import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const pauseCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa la reproducción actual'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay ninguna canción reproduciéndose.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (queue.paused) {
      const embed = MusicEmbeds.info('Estado', 'La reproducción ya se encuentra pausada. Usa `/resume` para continuar.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    queue.pause();
    const embed = MusicEmbeds.success('Pausado', '⏸️ La reproducción se ha pausado correctamente.');
    await interaction.reply({ embeds: [embed] });
  },
};
