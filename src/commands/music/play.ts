import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  VoiceBasedChannel,
} from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const playCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción o playlist desde YouTube, Spotify, SoundCloud, etc.')
    .addStringOption((option) =>
      option
        .setName('cancion')
        .setDescription('Nombre de la canción o enlace (YouTube, Spotify, SoundCloud)')
        .setRequired(true)
    ),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const query = interaction.options.getString('cancion', true);
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel as VoiceBasedChannel;
    const guildId = interaction.guildId;

    let isReqChannel = false;
    if (guildId) {
      const config = await client.guildRepo.get(guildId);
      isReqChannel = Boolean(config.requestChannelId && interaction.channelId === config.requestChannelId);
    }

    await interaction.deferReply(isReqChannel ? { flags: MessageFlags.Ephemeral } : undefined);

    try {
      await client.distube.play(voiceChannel, query, {
        textChannel: interaction.channel as any,
        member,
      });

      const embed = MusicEmbeds.info(
        'Búsqueda Completada',
        `🔎 Procesando solicitud: **${query}**`
      );
      await interaction.editReply({ embeds: [embed] });
    } catch (error: unknown) {
      console.error('Error en comando play:', error);
      const msg = error instanceof Error ? error.message : 'No se pudo reproducir la solicitud.';
      const embed = MusicEmbeds.error('Error al Reproducir', msg);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
