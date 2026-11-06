import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { getTranslation } from '../../i18n/index.js';
import { LastFmService } from '../../services/LastFmService.js';
import { Command } from '../../types/index.js';

export const lastfmCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('lastfm')
    .setDescription('Connect your Last.fm account for scrobbling and musical profiles')
    .addSubcommand((sub) =>
      sub
        .setName('set-user')
        .setDescription('Link your Last.fm profile username')
        .addStringOption((opt) =>
          opt
            .setName('usuario')
            .setDescription('Your Last.fm username')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('nowplaying')
        .setDescription('Display your current or most recent Last.fm scrobble')
    )
    .addSubcommand((sub) =>
      sub
        .setName('scrobble')
        .setDescription('Enable or disable automatic scrobbling')
        .addBooleanOption((opt) =>
          opt
            .setName('activo')
            .setDescription('Enable automatic scrobbling?')
            .setRequired(true)
        )
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const config = interaction.guildId ? await client.guildRepo.get(interaction.guildId) : null;
    const lang = config?.language || 'es';

    if (sub === 'set-user') {
      const username = interaction.options.getString('usuario', true);
      await client.guildRepo.updateUser(userId, { lastfmUsername: username, scrobbleEnabled: true });
      await interaction.reply({
        content: getTranslation(lang, 'lastfm.linked', { username }),
        ephemeral: true,
      });
      return;
    }

    if (sub === 'scrobble') {
      const enabled = interaction.options.getBoolean('activo', true);
      await client.guildRepo.updateUser(userId, { scrobbleEnabled: enabled });
      const msg = enabled ? getTranslation(lang, 'lastfm.scrobbleEnabled') : getTranslation(lang, 'lastfm.scrobbleDisabled');
      await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    if (sub === 'nowplaying') {
      const user = await client.guildRepo.getUser(userId);
      if (!user.lastfmUsername) {
        await interaction.reply({ content: getTranslation(lang, 'lastfm.notLinked'), ephemeral: true });
        return;
      }

      await interaction.deferReply();
      const track = await LastFmService.getRecentTrack(user.lastfmUsername);

      if (!track) {
        await interaction.editReply({
          content: `Could not retrieve scrobbles for **${user.lastfmUsername}** on Last.fm.`,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xd51007) // Last.fm Red
        .setAuthor({
          name: `${user.lastfmUsername}'s Last.fm ${track.isNowPlaying ? 'Now Playing' : 'Recent Track'}`,
          url: `https://www.last.fm/user/${user.lastfmUsername}`,
        })
        .setTitle(track.track)
        .addFields(
          { name: '🎤 Artist', value: track.artist, inline: true },
          { name: '💿 Album', value: track.album || 'Unknown', inline: true }
        )
        .setTimestamp();

      if (track.imageUrl) {
        embed.setThumbnail(track.imageUrl);
      }

      await interaction.editReply({ embeds: [embed] });
      return;
    }
  },
};

