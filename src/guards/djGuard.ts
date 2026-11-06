import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  PermissionsBitField,
  StringSelectMenuInteraction,
} from 'discord.js';
import type { BotClient } from '../client/BotClient.js';
import { MusicEmbeds } from '../music/MusicEmbeds.js';

export type AnyInteraction =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | StringSelectMenuInteraction;

export async function checkDjGuard(
  interaction: AnyInteraction,
  client: BotClient
): Promise<boolean> {
  if (!interaction.guildId || !interaction.member) {
    return true;
  }

  const member = interaction.member instanceof GuildMember
    ? interaction.member
    : await interaction.guild?.members.fetch(interaction.user.id);

  if (!member) {
    await replyDjError(interaction, 'No se pudieron verificar tus permisos en el servidor.');
    return false;
  }

  // Administrators and Guild Managers always bypass DJ restrictions
  if (
    member.permissions.has(PermissionsBitField.Flags.Administrator) ||
    member.permissions.has(PermissionsBitField.Flags.ManageGuild)
  ) {
    return true;
  }

  const config = await client.guildRepo.get(interaction.guildId);

  // If a DJ role is assigned, check if user has it
  const hasDjRole = config.djRoleId ? member.roles.cache.has(config.djRoleId) : false;
  if (hasDjRole) {
    return true;
  }

  // Check if user is the requester of the currently playing track
  const queue = client.distube.getQueue(interaction.guildId);
  const currentSong = queue?.songs[0];
  const isRequester = currentSong?.user?.id === interaction.user.id;

  if (config.djMode === 'everyone') {
    // If no role set and mode is 'everyone', all voice members or requesters can act
    if (!config.djRoleId || isRequester) {
      return true;
    }
  }

  // Otherwise, user lacks permission
  const reason = config.djRoleId
    ? `Esta acción requiere el rol de DJ (<@&${config.djRoleId}>) o permisos de Administrador.`
    : 'El servidor tiene activo el modo DJ estricto (`only_dj`). Se requiere rol de DJ o permisos de Administrador.';

  await replyDjError(interaction, reason);
  return false;
}

async function replyDjError(
  interaction: AnyInteraction,
  message: string
): Promise<void> {
  const embed = MusicEmbeds.error('Permiso de DJ Requerido', message);

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
  } else {
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}
