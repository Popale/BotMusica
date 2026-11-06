import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildTextBasedChannel,
  Message,
} from 'discord.js';
import type { Queue } from 'distube';
import type { BotClient } from '../client/BotClient.js';
import type { GuildConfig } from '../database/types.js';
import { getTranslation } from '../i18n/index.js';
import { MusicEmbeds } from './MusicEmbeds.js';

export function buildRequestChannelButtons(
  config: GuildConfig,
  isPaused = false
): ActionRowBuilder<ButtonBuilder>[] {
  const lang = config.language;
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('music:stop')
      .setEmoji('⏹️')
      .setLabel(getTranslation(lang, 'buttons.stop'))
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('music:previous')
      .setEmoji('⏮️')
      .setLabel(getTranslation(lang, 'buttons.previous'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music:pause_resume')
      .setEmoji(isPaused ? '▶️' : '⏸️')
      .setLabel(isPaused ? getTranslation(lang, 'buttons.resume') : getTranslation(lang, 'buttons.pause'))
      .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('music:skip')
      .setEmoji('⏭️')
      .setLabel(getTranslation(lang, 'buttons.skip'))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('music:shuffle')
      .setEmoji('🔀')
      .setLabel(getTranslation(lang, 'buttons.shuffle'))
      .setStyle(ButtonStyle.Secondary)
  );

  return [row];
}

export async function purgeRequestChannelExcept(
  channel: GuildTextBasedChannel,
  preserveMessageId?: string
): Promise<void> {
  try {
    const fetched = await channel.messages.fetch({ limit: 100 }).catch(() => null);
    if (!fetched || fetched.size === 0) return;

    const toDelete = fetched.filter((m) => !preserveMessageId || m.id !== preserveMessageId);
    if (toDelete.size === 0) return;

    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const bulkDeletable = toDelete.filter((m) => m.createdTimestamp > twoWeeksAgo);
    const older = toDelete.filter((m) => m.createdTimestamp <= twoWeeksAgo);

    if (bulkDeletable.size > 0) {
      await channel.bulkDelete(bulkDeletable, true).catch(() => null);
    }
    for (const [, oldMsg] of older) {
      await oldMsg.delete().catch(() => null);
    }
  } catch (err) {
    console.error('Error al purgar mensajes del canal de peticiones:', err);
  }
}

export async function syncRequestChannel(
  client: BotClient,
  guildId: string,
  queue?: Queue
): Promise<void> {
  try {
    const config = await client.guildRepo.get(guildId);
    if (!config.requestChannelId) return;

    const channel = (await client.channels
      .fetch(config.requestChannelId)
      .catch(() => null)) as GuildTextBasedChannel | null;
    if (!channel || !('messages' in channel)) return;

    const embed = MusicEmbeds.requestSystemEmbed(queue, config);
    const components = buildRequestChannelButtons(config, queue?.paused ?? false);

    let targetMessage: Message | null = null;
    if (config.requestMessageId) {
      targetMessage = await channel.messages.fetch(config.requestMessageId).catch(() => null);
    }

    if (targetMessage) {
      await targetMessage.edit({
        content: null,
        embeds: [embed],
        components,
        files: [],
      });
    } else {
      const newMessage = await channel.send({
        embeds: [embed],
        components,
      });
      await client.guildRepo.update(guildId, { requestMessageId: newMessage.id });
      targetMessage = newMessage;
    }

    await purgeRequestChannelExcept(channel, targetMessage.id);
  } catch (err) {
    console.error('Error al sincronizar canal de peticiones:', err);
  }
}

export async function resetRequestChannel(
  client: BotClient,
  guildId: string
): Promise<void> {
  await syncRequestChannel(client, guildId, undefined);
}
