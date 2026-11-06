import {
  Client,
  ClientOptions,
  Collection,
  GatewayIntentBits,
  Partials,
} from 'discord.js';
import DisTube from 'distube';
import type { DisTubePlugin } from 'distube';
import ffmpegStatic from 'ffmpeg-static';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { env } from '../config/env.js';
import { IGuildConfigRepository } from '../database/repositories/IGuildConfigRepository.js';
import { JsonGuildConfigRepository } from '../database/repositories/JsonGuildConfigRepository.js';
import { ButtonHandler, Command, SelectMenuHandler } from '../types/index.js';
import { registerMusicEvents } from '../events/musicEvents.js';

export class BotClient extends Client {
  public readonly distube: DisTube;
  public readonly guildRepo: IGuildConfigRepository;
  public readonly commands = new Collection<string, Command>();
  public readonly buttons = new Collection<string, ButtonHandler>();
  public readonly selectMenus = new Collection<string, SelectMenuHandler>();
  public readonly activePlayerMessages = new Map<string, { channelId: string; messageId: string }>();

  constructor(options?: Partial<ClientOptions>) {
    const intents = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ];

    if (env.enableMessageContent) {
      intents.push(GatewayIntentBits.MessageContent);
    }

    super({
      intents,
      partials: [Partials.Channel, Partials.Message],
      ...options,
    });

    this.guildRepo = new JsonGuildConfigRepository();

    const spotifyApi = env.spotifyClientId && env.spotifyClientSecret
      ? { clientId: env.spotifyClientId, clientSecret: env.spotifyClientSecret }
      : undefined;

    this.distube = new DisTube(this, {
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      ffmpeg: {
        path: ffmpegStatic || 'ffmpeg',
      },
      plugins: [
        new SpotifyPlugin({ api: spotifyApi }) as unknown as DisTubePlugin,
        new SoundCloudPlugin() as unknown as DisTubePlugin,
        new YtDlpPlugin() as unknown as DisTubePlugin,
      ],
    });

    registerMusicEvents(this);
  }

  public async start(): Promise<void> {
    await this.guildRepo.init();
    await this.login(env.discordToken);
  }

  public async shutdown(): Promise<void> {
    console.log('🔄 Guardando estado y cerrando conexiones...');
    await this.guildRepo.flush();
    this.destroy();
  }
}
