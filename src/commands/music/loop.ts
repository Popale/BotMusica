import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { RepeatMode } from 'distube';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const loopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Configura el modo de repetición')
    .addIntegerOption((opt) =>
      opt
        .setName('modo')
        .setDescription('Elige cómo repetir la música')
        .setRequired(true)
        .addChoices(
          { name: 'Desactivado', value: RepeatMode.DISABLED },
          { name: '🔂 Repetir esta canción', value: RepeatMode.SONG },
          { name: '🔁 Repetir toda la cola', value: RepeatMode.QUEUE }
        )
    ),
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

    const mode = interaction.options.getInteger('modo', true) as RepeatMode;
    queue.setRepeatMode(mode);

    let modeText = 'Desactivado';
    if (mode === RepeatMode.SONG) modeText = '🔂 Canción actual';
    if (mode === RepeatMode.QUEUE) modeText = '🔁 Toda la cola';

    const embed = MusicEmbeds.success('Modo de Repetición Actualizado', `Modo configurado en: **${modeText}**.`);
    await interaction.reply({ embeds: [embed] });
  },
};
