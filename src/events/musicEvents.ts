import { AttachmentBuilder, EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { Events } from 'distube';
import type { Playlist, Queue, Song } from 'distube';
import type { BotClient } from '../client/BotClient.js';
import { generateMusicCard } from '../music/card/musicCardGenerator.js';
import { MusicEmbeds } from '../music/MusicEmbeds.js';

export function registerMusicEvents(client: BotClient): void {
  const { distube } = client;

  distube.on(Events.PLAY_SONG, async (queue: Queue, song: Song) => {
    try {
      const channel = queue.textChannel as GuildTextBasedChannel | null;
      if (!channel) return;

      const guildId = queue.id;
      const config = await client.guildRepo.get(guildId);

      const sourceName = song.url?.includes('spotify')
        ? 'Spotify'
        : song.url?.includes('soundcloud')
        ? 'SoundCloud'
        : 'YouTube';

      // 1. Generate Custom Canvas Music Card
      const cardBuffer = await generateMusicCard({
        title: song.name || 'Unknown Track',
        artist: song.uploader?.name || 'Unknown Artist',
        coverUrl: song.thumbnail,
        themeColor: config.themeColor,
        sourceName,
      });

      const attachment = new AttachmentBuilder(cardBuffer, { name: 'card.png' });
      const embed = MusicEmbeds.nowPlaying(song, queue, config, 'card.png');
      const components = MusicEmbeds.playerControls(queue, config);

      const message = await channel.send({
        embeds: [embed],
        files: [attachment],
        components,
      });

      client.activePlayerMessages.set(guildId, {
        channelId: channel.id,
        messageId: message.id,
      });

      // 2. Update Dedicated Request Channel if configured
      if (config.requestChannelId && config.requestMessageId) {
        try {
          const reqChannel = (await client.channels.fetch(config.requestChannelId)) as GuildTextBasedChannel;
          if (reqChannel) {
            const reqMessage = await reqChannel.messages.fetch(config.requestMessageId);
            if (reqMessage) {
              const reqEmbed = MusicEmbeds.requestSystemEmbed(queue, config);
              await reqMessage.edit({ embeds: [reqEmbed] });
            }
          }
        } catch {
          // ignore error if message deleted
        }
      }
    } catch (err) {
      console.error('Error en playSong:', err);
    }
  });

  distube.on(Events.ADD_SONG, async (queue: Queue, song: Song) => {
    try {
      const channel = queue.textChannel as GuildTextBasedChannel | null;
      if (!channel) return;

      const config = await client.guildRepo.get(queue.id);
      const colorInt = parseInt(config.themeColor.replace('#', ''), 16) || 0xfd5279;

      const embed = new EmbedBuilder()
        .setColor(colorInt)
        .setAuthor({ name: '✅ Track Enqueued' })
        .setTitle(song.name ? (song.name.length > 55 ? `${song.name.slice(0, 52)}...` : song.name) : 'Track')
        .setURL(song.url || null)
        .addFields(
          { name: '⏱️ Duration', value: song.formattedDuration || '00:00', inline: true },
          { name: '📍 Position', value: `#${queue.songs.length}`, inline: true },
          { name: '👤 Requester', value: song.user ? `<@${song.user.id}>` : 'Unknown', inline: true }
        );

      if (song.thumbnail) embed.setThumbnail(song.thumbnail);
      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Error en addSong:', err);
    }
  });

  distube.on(Events.ADD_LIST, async (queue: Queue, playlist: Playlist) => {
    try {
      const channel = queue.textChannel as GuildTextBasedChannel | null;
      if (!channel) return;

      const config = await client.guildRepo.get(queue.id);
      const colorInt = parseInt(config.themeColor.replace('#', ''), 16) || 0xfd5279;

      const embed = new EmbedBuilder()
        .setColor(colorInt)
        .setTitle('✅ Playlist Added')
        .setDescription(`[${playlist.name}](${playlist.url})`)
        .addFields(
          { name: '🎵 Total Tracks', value: `${playlist.songs.length}`, inline: true },
          { name: '⏱️ Total Duration', value: playlist.formattedDuration || '00:00', inline: true },
          { name: '👤 Requester', value: playlist.user ? `<@${playlist.user.id}>` : 'Unknown', inline: true }
        );

      if (playlist.thumbnail) embed.setThumbnail(playlist.thumbnail);
      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Error en addList:', err);
    }
  });

  distube.on(Events.FINISH, async (queue: Queue) => {
    client.activePlayerMessages.delete(queue.id);
  });

  distube.on(Events.ERROR, (error: Error, queue: Queue) => {
    console.error('DisTube Error:', error.message);
    const channel = queue?.textChannel as GuildTextBasedChannel | null;
    if (channel && typeof channel.send === 'function') {
      const isKnown = error.message.includes('Sign in to confirm you’re not a bot');
      const desc = isKnown
        ? '⚠️ Stream blocked by provider. Trying alternate format or source...'
        : `⚠️ Playback error: \`${error.message.slice(0, 120)}\``;
      const embed = new EmbedBuilder().setColor(0xed4245).setDescription(desc);
      void channel.send({ embeds: [embed] }).catch(() => null);
    }
  });

  distube.on(Events.DISCONNECT, (queue: Queue) => {
    client.activePlayerMessages.delete(queue.id);
  });
}
