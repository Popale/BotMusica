import {
  ChannelType,
  ChatInputCommandInteraction,
  GuildTextBasedChannel,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { Command } from '../../types/index.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import {
  buildRequestChannelButtons,
  purgeRequestChannelExcept,
} from '../../music/requestChannelManager.js';

export const setupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Creates or links a dedicated song request channel with a persistent player panel')
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

    const targetChannel = channel as GuildTextBasedChannel;
    const config = await client.guildRepo.get(guild.id);

    // Clean existing messages in channel first so only one message will exist
    await purgeRequestChannelExcept(targetChannel);

    const embed = MusicEmbeds.requestSystemEmbed(undefined, config);
    const components = buildRequestChannelButtons(config, false);

    const message = await targetChannel.send({
      embeds: [embed],
      components,
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
