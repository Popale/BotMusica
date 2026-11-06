import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const queueCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the queued songs with pagination controls')
    .addIntegerOption((opt) =>
      opt
        .setName('pagina')
        .setDescription('Page number')
        .setMinValue(1)
        .setRequired(false)
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue || queue.songs.length === 0) {
      const embed = MusicEmbeds.error('Queue Empty', 'There are no songs in the queue.');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const config = await client.guildRepo.get(guildId);
    const page = interaction.options.getInteger('pagina') ?? 1;
    const { embed, components } = MusicEmbeds.queue(queue, page, config);

    await interaction.reply({ embeds: [embed], components });
  },
};
