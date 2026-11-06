import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { RepeatMode } from 'distube';
import type { Queue, Song } from 'distube';
import { GuildConfig } from '../database/types.js';
import { getTranslation } from '../i18n/index.js';

export const COLORS = {
  PRIMARY: 0xfd5279, // Listune Rose Pink
  SUCCESS: 0x57f287,
  WARNING: 0xfee75c,
  DANGER: 0xed4245,
  PAUSE: 0xf39c12,
  QUEUE: 0x2b2d31,
} as const;

export class MusicEmbeds {
  public static nowPlaying(
    song: Song,
    queue: Queue,
    config: GuildConfig,
    bannerAttachmentName = 'card.png'
  ): EmbedBuilder {
    const lang = config.language;
    const isPaused = queue.paused;
    const colorInt = parseInt(config.themeColor.replace('#', ''), 16) || COLORS.PRIMARY;

    const sourceName = song.url?.includes('spotify')
      ? 'Spotify'
      : song.url?.includes('soundcloud')
      ? 'SoundCloud'
      : 'YouTube';

    const artistName = song.uploader?.name || getTranslation(lang, 'common.unknownArtist');

    const embed = new EmbedBuilder()
      .setColor(colorInt)
      .setAuthor({
        name: `💿 ${getTranslation(lang, isPaused ? 'common.paused' : 'player.header')}`,
      })
      .setTitle(song.name ? (song.name.length > 60 ? `${song.name.slice(0, 57)}...` : song.name) : 'Track')
      .setURL(song.url || null)
      .addFields(
        {
          name: `🎤 ${artistName} 🎵`,
          value: `⏱️ **${song.formattedDuration || '00:00'}**`,
          inline: true,
        },
        {
          name: `🔊 **${queue.volume}%**`,
          value: `..:: **${sourceName}**`,
          inline: true,
        }
      )
      .setImage(`attachment://${bannerAttachmentName}`)
      .setFooter({
        text: getTranslation(lang, 'player.queueFooter', {
          count: queue.songs.length,
          duration: queue.formattedDuration || '00:00',
        }),
      });

    return embed;
  }

  public static playerControls(queue: Queue, config: GuildConfig): ActionRowBuilder<any>[] {
    const lang = config.language;
    const isPaused = queue.paused;
    const isLoop = queue.repeatMode !== RepeatMode.DISABLED;

    // 1. Recommended Dropdown (Quick Genre Radio suggestions)
    const recommendedMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('music:recommended_select')
        .setPlaceholder(getTranslation(lang, 'player.recommendedPlaceholder'))
        .addOptions(
          new StringSelectMenuOptionBuilder().setLabel('Pop Hits Radio').setValue('rec_pop_hits').setDescription('Today top trending pop tracks').setEmoji('✨'),
          new StringSelectMenuOptionBuilder().setLabel('Lo-Fi Chill & Study').setValue('rec_lofi_chill').setDescription('Relaxing beats to study/chill').setEmoji('☕'),
          new StringSelectMenuOptionBuilder().setLabel('Hip-Hop & Rap Essentials').setValue('rec_hiphop').setDescription('Top hip-hop and rap releases').setEmoji('🔥'),
          new StringSelectMenuOptionBuilder().setLabel('Rock Classics & Modern').setValue('rec_rock').setDescription('Best legendary rock anthems').setEmoji('🎸'),
          new StringSelectMenuOptionBuilder().setLabel('Electronic & Synthwave').setValue('rec_synthwave').setDescription('Upbeat synthwave and dance').setEmoji('⚡')
        )
    );

    // 2. Audio Filters Dropdown
    const filterMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('music:filter_select')
        .setPlaceholder(getTranslation(lang, 'player.filtersPlaceholder'))
        .addOptions(
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.clear')).setValue('filter_clear').setEmoji('🧹'),
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.bassboost')).setValue('filter_bassboost').setEmoji('🔊'),
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.3d')).setValue('filter_3d').setEmoji('🎧'),
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.nightcore')).setValue('filter_nightcore').setEmoji('⚡'),
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.vaporwave')).setValue('filter_vaporwave').setEmoji('🌊'),
          new StringSelectMenuOptionBuilder().setLabel(getTranslation(lang, 'filters.echo')).setValue('filter_echo').setEmoji('📢')
        )
    );

    // 3. Row 1 Buttons
    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('music:shuffle').setEmoji('🔀').setLabel(getTranslation(lang, 'buttons.shuffle')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:previous').setEmoji('⏮️').setLabel(getTranslation(lang, 'buttons.previous')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:pause_resume').setEmoji(isPaused ? '▶️' : '⏸️').setLabel(isPaused ? getTranslation(lang, 'buttons.resume') : getTranslation(lang, 'buttons.pause')).setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('music:skip').setEmoji('⏭️').setLabel(getTranslation(lang, 'buttons.skip')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:loop').setEmoji('🔁').setLabel(getTranslation(lang, 'buttons.loop')).setStyle(isLoop ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );

    // 4. Row 2 Buttons
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('music:toggle_autoplay').setEmoji('📻').setLabel(getTranslation(lang, 'buttons.autoplay')).setStyle(queue.autoplay ? ButtonStyle.Primary : ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:vol_down').setEmoji('🔉').setLabel(getTranslation(lang, 'buttons.volumeDown')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:stop').setEmoji('⏹️').setLabel(getTranslation(lang, 'buttons.stop')).setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('music:vol_up').setEmoji('🔊').setLabel(getTranslation(lang, 'buttons.volumeUp')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:view_queue').setEmoji('📜').setLabel(getTranslation(lang, 'buttons.queue')).setStyle(ButtonStyle.Secondary)
    );

    return [recommendedMenu, filterMenu, row1, row2];
  }

  public static queue(
    queue: Queue,
    page = 1,
    config: GuildConfig,
    pageSize = 10
  ): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
    const lang = config.language;
    const totalSongs = queue.songs.length;
    const maxPages = Math.max(1, Math.ceil(totalSongs / pageSize));
    const currentPage = Math.min(Math.max(1, page), maxPages);
    const colorInt = parseInt(config.themeColor.replace('#', ''), 16) || COLORS.PRIMARY;

    const startIndex = (currentPage - 1) * pageSize;
    const currentSongs = queue.songs.slice(startIndex, startIndex + pageSize);

    const trackList = currentSongs
      .map((song: Song, idx: number) => {
        const absoluteIndex = startIndex + idx;
        const prefix = absoluteIndex === 0 ? '▶️ **Now:**' : `\`${absoluteIndex}.\``;
        const title = song.name || 'Untitled';
        return `${prefix} [${title.length > 45 ? `${title.slice(0, 42)}...` : title}](${song.url}) - \`${song.formattedDuration || '00:00'}\``;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(colorInt)
      .setTitle(getTranslation(lang, 'queue.title', { count: totalSongs }))
      .setDescription(trackList || getTranslation(lang, 'queue.empty'))
      .setFooter({ text: getTranslation(lang, 'queue.page', { page: currentPage, maxPages }) });

    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (maxPages > 1) {
      components.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId(`music:queue_page:${currentPage - 1}`).setLabel(getTranslation(lang, 'queue.prev')).setEmoji('◀️').setStyle(ButtonStyle.Secondary).setDisabled(currentPage <= 1),
          new ButtonBuilder().setCustomId(`music:queue_page:${currentPage + 1}`).setLabel(getTranslation(lang, 'queue.next')).setEmoji('▶️').setStyle(ButtonStyle.Secondary).setDisabled(currentPage >= maxPages)
        )
      );
    }

    return { embed, components };
  }

  public static requestSystemEmbed(queue: Queue | undefined, config: GuildConfig): EmbedBuilder {
    const lang = config.language;
    const colorInt = parseInt(config.themeColor.replace('#', ''), 16) || COLORS.PRIMARY;

    const embed = new EmbedBuilder()
      .setColor(colorInt)
      .setTitle(`🎶 ${getTranslation(lang, 'player.requestTitle')}`);

    if (queue && queue.songs.length > 0) {
      const current = queue.songs[0];
      const sourceName = current.url?.includes('spotify')
        ? 'Spotify'
        : current.url?.includes('soundcloud')
        ? 'SoundCloud'
        : 'YouTube';
      const artist = current.uploader?.name || getTranslation(lang, 'common.unknownArtist');

      const upcoming = queue.songs.slice(1, 11);
      const upcomingList =
        upcoming.length > 0
          ? upcoming
              .map((s, i) => `\`${i + 1}.\` **${s.name ?? 'Track'}** - \`${s.formattedDuration ?? '00:00'}\``)
              .join('\n')
          : getTranslation(lang, 'player.noSongsInQueue');

      embed
        .setAuthor({
          name: `💿 ${getTranslation(lang, queue.paused ? 'common.paused' : 'player.header')}`,
        })
        .setDescription(
          `**${getTranslation(lang, 'common.nowPlaying')}:** [${current.name ?? 'Track'}](${current.url ?? ''})\n\n` +
            `🎤 **${artist}** 🎵 \u2000|\u2000 ⏱️ **${current.formattedDuration ?? '00:00'}**\n` +
            `🔊 **${queue.volume}%** \u2000|\u2000 ..:: **${sourceName}**\n\n` +
            `**${getTranslation(lang, 'player.songsInQueue')}:**\n${upcomingList}`
        )
        .setFooter({
          text: getTranslation(lang, 'player.tracksLeft', {
            count: Math.max(0, queue.songs.length - 1),
            duration: queue.formattedDuration || '00:00',
          }),
        });

      if (current.thumbnail) embed.setThumbnail(current.thumbnail);
    } else {
      embed
        .setDescription(
          `**${getTranslation(lang, 'queue.empty')}**\n\n` +
            `✨ ${getTranslation(lang, 'player.requestTitle')}`
        )
        .setFooter({
          text: `Prefix: ${config.prefix} | Multi-language (ES / EN / PT)`,
        });
    }

    return embed;
  }

  public static success(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder().setColor(COLORS.SUCCESS).setTitle(`✅ ${title}`).setDescription(description);
  }

  public static error(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder().setColor(COLORS.DANGER).setTitle(`❌ ${title}`).setDescription(description);
  }

  public static info(title: string, description: string): EmbedBuilder {
    return new EmbedBuilder().setColor(COLORS.PRIMARY).setTitle(`ℹ️ ${title}`).setDescription(description);
  }
}
