import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  StringSelectMenuInteraction,
  VoiceBasedChannel,
} from 'discord.js';
import type { BotClient } from '../client/BotClient.js';
import { MusicEmbeds } from '../music/MusicEmbeds.js';

export interface VoiceGuardResult {
  allowed: boolean;
  userVoiceChannel?: VoiceBasedChannel;
  botVoiceChannel?: VoiceBasedChannel;
}

export type AnyInteraction =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | StringSelectMenuInteraction;

export async function checkVoiceGuard(
  interaction: AnyInteraction,
  _client: BotClient,
  options: { requireVoice?: boolean; requireSameVoice?: boolean } = {}
): Promise<VoiceGuardResult> {
  const member = interaction.member;
  if (!member || !(member instanceof GuildMember)) {
    await replyGuardError(interaction, 'No se pudo verificar tu estado en el servidor.');
    return { allowed: false };
  }

  const userVoiceChannel = member.voice.channel;
  const botMember = interaction.guild?.members.me;
  const botVoiceChannel = botMember?.voice.channel;

  if (options.requireVoice && !userVoiceChannel) {
    await replyGuardError(
      interaction,
      '¡Debes estar conectado a un canal de voz para usar este comando!'
    );
    return { allowed: false };
  }

  if (options.requireSameVoice && botVoiceChannel && userVoiceChannel?.id !== botVoiceChannel.id) {
    await replyGuardError(
      interaction,
      `¡Debes estar en el mismo canal de voz que el bot (<#${botVoiceChannel.id}>)!`
    );
    return { allowed: false, userVoiceChannel: userVoiceChannel || undefined, botVoiceChannel };
  }

  return {
    allowed: true,
    userVoiceChannel: userVoiceChannel || undefined,
    botVoiceChannel: botVoiceChannel || undefined,
  };
}

async function replyGuardError(
  interaction: AnyInteraction,
  message: string
): Promise<void> {
  const embed = MusicEmbeds.error('Canal de Voz Requerido', message);

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
  } else {
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}
