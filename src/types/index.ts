import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import type { BotClient } from '../client/BotClient.js';

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  voiceChannelRequired?: boolean;
  sameVoiceChannelRequired?: boolean;
  djRoleRequired?: boolean;
  execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void>;
}

export interface ButtonHandler {
  idPrefix: string;
  voiceChannelRequired?: boolean;
  sameVoiceChannelRequired?: boolean;
  djRoleRequired?: boolean;
  execute(interaction: ButtonInteraction, client: BotClient): Promise<void>;
}

export interface SelectMenuHandler {
  idPrefix: string;
  voiceChannelRequired?: boolean;
  sameVoiceChannelRequired?: boolean;
  djRoleRequired?: boolean;
  execute(interaction: StringSelectMenuInteraction, client: BotClient): Promise<void>;
}
