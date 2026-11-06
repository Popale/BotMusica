import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { getTranslation } from '../../i18n/index.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const setupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Creates or links a dedicated song request channel with live interactive queue')
    .addChannelOption((opt) =>
      opt
        .setName('canal')
        .setDescription('Channel to use for requests (leave blank to create a new one)')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guild = interaction.guild;
    if (!guild || !interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({
        content: '❌ You need Manage Channels permission to configure the request channel.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let channel = interaction.options.getChannel('canal');

    if (!channel) {
      channel = await guild.channels.create({
        name: 'music-requests',
        type: ChannelType.GuildText,
        topic: '🎵 Type a song name or paste a link to play music instantly!',
      });
    }

    const targetChannel = channel as any;
    const config = await client.guildRepo.get(guild.id);
    const lang = config.language;

    const embed = MusicEmbeds.requestSystemEmbed(undefined, config);
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('music:stop').setEmoji('⏹️').setLabel(getTranslation(lang, 'buttons.stop')).setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('music:previous').setEmoji('⏮️').setLabel(getTranslation(lang, 'buttons.previous')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:pause_resume').setEmoji('⏯️').setLabel(getTranslation(lang, 'buttons.pause')).setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('music:skip').setEmoji('⏭️').setLabel(getTranslation(lang, 'buttons.skip')).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('music:shuffle').setEmoji('🔀').setLabel(getTranslation(lang, 'buttons.shuffle')).setStyle(ButtonStyle.Secondary)
    );

    const message = await targetChannel.send({
      embeds: [embed],
      components: [buttons],
    });

    await client.guildRepo.update(guild.id, {
      requestChannelId: targetChannel.id,
      requestMessageId: message.id,
    });

    await interaction.editReply({
      content: `✅ Dedicated music request channel successfully configured in <#${targetChannel.id}>!`,
    });
  },
};
