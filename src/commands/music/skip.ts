import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const skipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta a la siguiente canción en la cola de reproducción'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue || queue.songs.length === 0) {
      const embed = MusicEmbeds.error('Cola Vacía', 'No hay ninguna canción reproduciéndose.');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    try {
      if (queue.songs.length <= 1 && !queue.autoplay) {
        await queue.stop();
        const embed = MusicEmbeds.info('Canción Saltada', 'No hay más pistas en la cola. La reproducción se ha detenido.');
        await interaction.reply({ embeds: [embed] });
      } else {
        await queue.skip();
        const embed = MusicEmbeds.success('Canción Saltada', '⏭️ Se ha avanzado a la siguiente pista.');
        await interaction.reply({ embeds: [embed] });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo saltar la canción.';
      const embed = MusicEmbeds.error('Error', msg);
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  },
};
