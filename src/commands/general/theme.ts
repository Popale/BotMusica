import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { Command } from '../../types/index.js';

export const themeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('theme')
    .setDescription('Customizes the color theme of the music embeds and banner card')
    .addStringOption((opt) =>
      opt
        .setName('color')
        .setDescription('Hex color code (e.g. #FD5279) or choose a preset')
        .setRequired(true)
        .addChoices(
          { name: '🌸 Listune Rose Pink (#FD5279)', value: '#FD5279' },
          { name: '💜 Royal Purple (#7209B7)', value: '#7209B7' },
          { name: '💙 Discord Blurple (#5865F2)', value: '#5865F2' },
          { name: '💎 Neon Cyan (#00F5D4)', value: '#00F5D4' },
          { name: '🔥 Sunset Orange (#F77F00)', value: '#F77F00' },
          { name: '🖤 Midnight Dark (#1E1E24)', value: '#1E1E24' }
        )
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    if (!interaction.guildId) return;

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: '❌ You need Manage Server permission to change the theme.',
        ephemeral: true,
      });
      return;
    }

    const colorHex = interaction.options.getString('color', true);
    await client.guildRepo.update(interaction.guildId, { themeColor: colorHex });

    const colorInt = parseInt(colorHex.replace('#', ''), 16);
    const embed = new EmbedBuilder()
      .setColor(colorInt)
      .setTitle('🎨 Theme Updated')
      .setDescription(`The server theme color has been updated to **${colorHex}**! Future now-playing embeds and banners will use this style.`);

    await interaction.reply({ embeds: [embed] });
  },
};

