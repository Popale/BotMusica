import { Events, GuildMember, Message, VoiceBasedChannel } from 'discord.js';
import type { BotClient } from '../client/BotClient.js';
import { getTranslation } from '../i18n/index.js';

export function registerMessageEvents(client: BotClient): void {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot || !message.guildId || !message.member) return;

    const config = await client.guildRepo.get(message.guildId);

    // 1. Dedicated Song Request Channel (No prefix needed in request channel!)
    if (config.requestChannelId && message.channelId === config.requestChannelId) {
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        const reply = await message.reply('⚠️ Please join a voice channel first!');
        setTimeout(() => void reply.delete().catch(() => null), 4000);
        setTimeout(() => void message.delete().catch(() => null), 2000);
        return;
      }

      const query = message.content.trim();
      if (!query) return;

      try {
        await client.distube.play(voiceChannel, query, {
          textChannel: message.channel as any,
          member: message.member,
        });
      } catch (err) {
        console.error('Request channel error:', err);
      } finally {
        setTimeout(() => void message.delete().catch(() => null), 1500);
      }
      return;
    }

    // 2. Standard Prefix Command Processing
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const lang = config.language;
    const member = message.member as GuildMember;
    const voiceChannel = member.voice.channel as VoiceBasedChannel | null;

    switch (commandName) {
      case 'play':
      case 'p': {
        const query = args.join(' ');
        if (!query) {
          await message.reply(`Usage: \`${config.prefix}play <song title or URL>\``);
          return;
        }
        if (!voiceChannel) {
          await message.reply(getTranslation(lang, 'common.voiceRequired'));
          return;
        }
        await client.distube.play(voiceChannel, query, {
          textChannel: message.channel as any,
          member,
        });
        break;
      }

      case 'skip':
      case 's':
      case 'next': {
        const queue = client.distube.getQueue(message.guildId);
        if (!queue) {
          await message.reply(getTranslation(lang, 'queue.empty'));
          return;
        }
        if (queue.songs.length <= 1 && !queue.autoplay) {
          await queue.stop();
        } else {
          await queue.skip();
        }
        await message.reply(getTranslation(lang, 'commands.skipped'));
        break;
      }

      case 'pause': {
        const queue = client.distube.getQueue(message.guildId);
        if (!queue) return;
        queue.pause();
        await message.reply(getTranslation(lang, 'commands.paused'));
        break;
      }

      case 'resume':
      case 'r': {
        const queue = client.distube.getQueue(message.guildId);
        if (!queue) return;
        queue.resume();
        await message.reply(getTranslation(lang, 'commands.resumed'));
        break;
      }

      case 'stop': {
        const queue = client.distube.getQueue(message.guildId);
        if (!queue) return;
        await queue.stop();
        await message.reply(getTranslation(lang, 'commands.stopped'));
        break;
      }

      case 'volume':
      case 'vol':
      case 'v': {
        const queue = client.distube.getQueue(message.guildId);
        if (!queue) return;
        const level = parseInt(args[0], 10);
        if (isNaN(level) || level < 1 || level > 100) {
          await message.reply(`Usage: \`${config.prefix}volume <1-100>\``);
          return;
        }
        queue.setVolume(level);
        await message.reply(getTranslation(lang, 'commands.volumeSet', { volume: level }));
        break;
      }

      case 'prefix': {
        const newPrefix = args[0];
        if (!newPrefix) {
          await message.reply(`Current prefix is: \`${config.prefix}\``);
          return;
        }
        await client.guildRepo.update(message.guildId, { prefix: newPrefix });
        await message.reply(`✅ Server prefix updated to: \`${newPrefix}\``);
        break;
      }

      case 'ping': {
        await message.reply(`🏓 Pong! Latency: \`${client.ws.ping}ms\``);
        break;
      }

      default:
        break;
    }
  });
}

