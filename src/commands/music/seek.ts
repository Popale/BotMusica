import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { formatDuration } from '../../music/utils/progressBar.js';
import { Command } from '../../types/index.js';

function parseTimeToSeconds(input: string): number | null {
  const parts = input.trim().split(':').map((p) => Number(p));
  if (parts.some((p) => isNaN(p) || p < 0)) return null;

  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

export const seekCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Avanza o retrocede a un segundo o minuto específico (ej: 90 o 01:30)')
    .addStringOption((opt) =>
      opt
        .setName('posicion')
        .setDescription('Tiempo de destino en segundos o formato mm:ss (ej: 02:15 o 135)')
        .setRequired(true)
    ),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue || queue.songs.length === 0) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay ninguna canción reproduciéndose.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const currentSong = queue.songs[0];
    const timeInput = interaction.options.getString('posicion', true);
    const targetSeconds = parseTimeToSeconds(timeInput);

    if (targetSeconds === null) {
      const embed = MusicEmbeds.error(
        'Formato Inválido',
        'Por favor ingresa un formato de tiempo válido (ejemplos: `90`, `01:30`, `01:15:00`).'
      );
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (targetSeconds > currentSong.duration) {
      const embed = MusicEmbeds.error(
        'Tiempo Fuera de Rango',
        `La canción dura solo **${currentSong.formattedDuration}** (${currentSong.duration} segundos).`
      );
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    queue.seek(targetSeconds);
    const embed = MusicEmbeds.success(
      'Posición Modificada',
      `⏩ Saltando a **${formatDuration(targetSeconds)}**.`
    );
    await interaction.reply({ embeds: [embed] });
  },
};
