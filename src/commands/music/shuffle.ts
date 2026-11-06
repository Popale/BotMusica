import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const shuffleCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla aleatoriamente las canciones de la cola'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue || queue.songs.length <= 1) {
      const embed = MusicEmbeds.error('Cola Insuficiente', 'Se necesitan al menos 2 canciones en la cola para mezclar.');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    await queue.shuffle();
    const embed = MusicEmbeds.success('Cola Mezclada', '🔀 Las pistas han sido reordenadas aleatoriamente.');
    await interaction.reply({ embeds: [embed] });
  },
};
