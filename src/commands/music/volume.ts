import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const volumeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Ajusta el volumen de la música (1-100%)')
    .addIntegerOption((opt) =>
      opt
        .setName('nivel')
        .setDescription('Nivel de volumen en porcentaje (1 - 100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay música activa para ajustar el volumen.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const volume = interaction.options.getInteger('nivel', true);
    queue.setVolume(volume);

    const embed = MusicEmbeds.success(
      'Volumen Ajustado',
      `🔊 El volumen se ha establecido en **${volume}%**.`
    );
    await interaction.reply({ embeds: [embed] });
  },
};
