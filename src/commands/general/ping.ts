import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { COLORS } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Comprueba la latencia del bot y de la API de Discord'),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const sent = await interaction.reply({ content: 'Calculando ping...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsPing = client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 Latencia de Interacción', value: `\`${roundtrip}ms\``, inline: true },
        { name: '💓 Latencia WebSocket', value: `\`${wsPing >= 0 ? wsPing : 0}ms\``, inline: true }
      );

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
