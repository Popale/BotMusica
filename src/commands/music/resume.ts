import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const resumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Reanuda la reproducción pausada'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay ninguna canción en curso.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!queue.paused) {
      const embed = MusicEmbeds.info('Estado', 'La reproducción ya está activa.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    queue.resume();
    const embed = MusicEmbeds.success('Reanudado', '▶️ La reproducción se ha reanudado.');
    await interaction.reply({ embeds: [embed] });
  },
};
