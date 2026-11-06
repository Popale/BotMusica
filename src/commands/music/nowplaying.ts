import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const nowPlayingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Displays the interactive player card and controls'),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue || queue.songs.length === 0) {
      const embed = MusicEmbeds.error('No Track', 'There is no track currently playing.');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const currentSong = queue.songs[0];
    const config = await client.guildRepo.get(guildId);
    const embed = MusicEmbeds.nowPlaying(currentSong, queue, config);
    const components = MusicEmbeds.playerControls(queue, config);

    await interaction.reply({
      embeds: [embed],
      components,
    });
  },
};
