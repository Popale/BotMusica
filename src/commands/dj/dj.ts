import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { COLORS, MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const djCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('dj')
    .setDescription('Administra la configuración del sistema de DJ del servidor')
    .addSubcommand((sub) =>
      sub
        .setName('set-role')
        .setDescription('Asigna un rol como Rol de DJ oficial del servidor')
        .addRoleOption((opt) =>
          opt
            .setName('rol')
            .setDescription('El rol de Discord a asignar como DJ')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove-role')
        .setDescription('Elimina el rol de DJ configurado')
    )
    .addSubcommand((sub) =>
      sub
        .setName('mode')
        .setDescription('Configura las restricciones de uso del bot')
        .addStringOption((opt) =>
          opt
            .setName('tipo')
            .setDescription('Modo de acceso a los controles de música')
            .setRequired(true)
            .addChoices(
              { name: '🛡️ Solo DJ (solo miembros con rol de DJ o Admin pueden controlar)', value: 'only_dj' },
              { name: '👥 Libre (cualquiera en voz o el solicitante de la canción)', value: 'everyone' }
            )
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('status')
        .setDescription('Muestra el estado actual del sistema de DJ')
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const subcommand = interaction.options.getSubcommand();

    // Check admin permissions for modification subcommands
    if (subcommand !== 'status') {
      const memberPermissions = interaction.memberPermissions;
      if (
        !memberPermissions?.has(PermissionFlagsBits.Administrator) &&
        !memberPermissions?.has(PermissionFlagsBits.ManageGuild)
      ) {
        const errorEmbed = MusicEmbeds.error(
          'Permisos Insuficientes',
          'Necesitas permisos de **Administrador** o **Gestionar Servidor** para cambiar la configuración de DJ.'
        );
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        return;
      }
    }

    if (subcommand === 'set-role') {
      const role = interaction.options.getRole('rol', true);
      const updated = await client.guildRepo.update(guildId, { djRoleId: role.id });

      const embed = MusicEmbeds.success(
        'Rol de DJ Configurado',
        `🎧 El rol de DJ ha sido asignado a <@&${updated.djRoleId}>.\nLos miembros con este rol tendrán permisos para gestionar la música.`
      );
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'remove-role') {
      await client.guildRepo.update(guildId, { djRoleId: null });

      const embed = MusicEmbeds.info(
        'Rol de DJ Eliminado',
        'Se ha quitado la asignación del rol de DJ. Ahora cualquier usuario podrá controlar el reproductor según el modo configurado.'
      );
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'mode') {
      const mode = interaction.options.getString('tipo', true) as 'only_dj' | 'everyone';
      const updated = await client.guildRepo.update(guildId, { djMode: mode });

      const modeDescription =
        updated.djMode === 'only_dj'
          ? '🔒 **Solo DJ / Admins**: Únicamente los usuarios con el rol de DJ o Administradores pueden pausar, saltar, detener, modificar volumen y ecualizador.'
          : '🔓 **Libre**: Cualquier miembro conectado al canal de voz puede interactuar, y quien haya pedido la pista siempre podrá gestionarla.';

      const embed = MusicEmbeds.success('Modo DJ Actualizado', modeDescription);
      await interaction.reply({ embeds: [embed] });
      return;
    }

    if (subcommand === 'status') {
      const config = await client.guildRepo.get(guildId);
      const roleText = config.djRoleId ? `<@&${config.djRoleId}>` : '`Ninguno configurado`';
      const modeText = config.djMode === 'only_dj' ? '🛡️ Estricto (Solo DJ y Admins)' : '👥 Libre (Todos / Solicitante)';

      const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('🎧 Configuración del Sistema de DJ')
        .setDescription('Estado actual de permisos y roles de música en este servidor:')
        .addFields(
          { name: '🛡️ Rol de DJ Asignado', value: roleText, inline: true },
          { name: '⚙️ Modo de Control', value: modeText, inline: true },
          { name: '🔊 Volumen por Defecto', value: `${config.defaultVolume}%`, inline: true }
        )
        .setFooter({ text: 'Usa /dj set-role o /dj mode para realizar cambios' });

      await interaction.reply({ embeds: [embed] });
      return;
    }
  },
};
