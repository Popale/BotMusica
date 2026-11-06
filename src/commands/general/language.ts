import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { SupportedLanguage } from '../../database/types.js';
import { Command } from '../../types/index.js';

export const languageCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change the bot language for this server')
    .addStringOption((opt) =>
      opt
        .setName('idioma')
        .setDescription('Select your preferred language')
        .setRequired(true)
        .addChoices(
          { name: '🇪🇸 Español (Spanish)', value: 'es' },
          { name: '🇺🇸 English', value: 'en' },
          { name: '🇧🇷 Português (Portuguese)', value: 'pt' }
        )
    ),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    if (!interaction.guildId) return;

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: '❌ You need Manage Server permission to change the server language.',
        ephemeral: true,
      });
      return;
    }

    const selected = interaction.options.getString('idioma', true) as SupportedLanguage;
    await client.guildRepo.update(interaction.guildId, { language: selected });

    const messages = {
      es: '🇪🇸 Idioma del servidor actualizado a **Español**.',
      en: '🇺🇸 Server language updated to **English**.',
      pt: '🇧🇷 Idioma do servidor atualizado para **Português**.',
    };

    await interaction.reply({ content: messages[selected] });
  },
};

