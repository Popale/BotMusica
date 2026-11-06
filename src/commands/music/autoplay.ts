import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const autoplayCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Activa o desactiva la reproducción automática de canciones recomendadas'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay ninguna cola activa.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const state = queue.toggleAutoplay();
    const embed = MusicEmbeds.success(
      'Autoplay Actualizado',
      `📻 La reproducción automática ahora está **${state ? 'ACTIVADA' : 'DESACTIVADA'}**.`
    );
    await interaction.reply({ embeds: [embed] });
  },
};
