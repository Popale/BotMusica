import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { resetRequestChannel } from '../../music/requestChannelManager.js';
import { Command } from '../../types/index.js';

export const stopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproducción, borra la cola y abandona el canal de voz'),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay música reproduciéndose.');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const config = await client.guildRepo.get(guildId);
    const isReqChannel = Boolean(config.requestChannelId && interaction.channelId === config.requestChannelId);

    await queue.stop();
    const embed = MusicEmbeds.info('Detenido', '⏹️ La música se ha detenido y la cola fue vaciada.');
    await interaction.reply({
      embeds: [embed],
      flags: isReqChannel ? MessageFlags.Ephemeral : undefined,
    });

    await resetRequestChannel(client, guildId);
  },
};
