import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../../config/env.js';
import { GuildConfig, GuildConfigUpdate, UserConfig, UserConfigUpdate } from '../types.js';
import { IGuildConfigRepository } from './IGuildConfigRepository.js';

interface StorageSchema {
  guilds: Record<string, GuildConfig>;
  users: Record<string, UserConfig>;
}

export class JsonGuildConfigRepository implements IGuildConfigRepository {
  private readonly filePath: string;
  private guildCache = new Map<string, GuildConfig>();
  private userCache = new Map<string, UserConfig>();
  private isDirty = false;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor(storageDir = path.resolve(process.cwd(), 'data')) {
    this.filePath = path.join(storageDir, 'guild_configs.json');
  }

  public async init(): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      const raw = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as StorageSchema | Record<string, GuildConfig>;

      // Backwards compatibility migration
      if ('guilds' in parsed && typeof parsed.guilds === 'object') {
        for (const [k, v] of Object.entries(parsed.guilds)) {
          this.guildCache.set(k, this.normalizeGuildConfig(v));
        }
        if (parsed.users && typeof parsed.users === 'object') {
          for (const [k, v] of Object.entries(parsed.users)) {
            this.userCache.set(k, v);
          }
        }
      } else {
        for (const [k, v] of Object.entries(parsed)) {
          this.guildCache.set(k, this.normalizeGuildConfig(v as GuildConfig));
        }
      }
    } catch {
      this.guildCache = new Map();
      this.userCache = new Map();
      await this.saveToFile();
    }
  }

  private normalizeGuildConfig(raw: Partial<GuildConfig>): GuildConfig {
    return {
      guildId: raw.guildId || '',
      prefix: raw.prefix || env.defaultPrefix,
      language: raw.language || env.defaultLanguage,
      djRoleId: raw.djRoleId ?? null,
      djMode: raw.djMode || 'everyone',
      defaultVolume: raw.defaultVolume || env.defaultVolume,
      themeColor: raw.themeColor || env.defaultThemeColor,
      requestChannelId: raw.requestChannelId ?? null,
      requestMessageId: raw.requestMessageId ?? null,
      updatedAt: raw.updatedAt || Date.now(),
    };
  }

  public async get(guildId: string): Promise<GuildConfig> {
    const existing = this.guildCache.get(guildId);
    if (existing) {
      return { ...existing };
    }

    const defaultConfig: GuildConfig = {
      guildId,
      prefix: env.defaultPrefix,
      language: env.defaultLanguage,
      djRoleId: null,
      djMode: 'everyone',
      defaultVolume: env.defaultVolume,
      themeColor: env.defaultThemeColor,
      requestChannelId: null,
      requestMessageId: null,
      updatedAt: Date.now(),
    };

    this.guildCache.set(guildId, defaultConfig);
    this.scheduleSave();
    return { ...defaultConfig };
  }

  public async update(guildId: string, partial: GuildConfigUpdate): Promise<GuildConfig> {
    const current = await this.get(guildId);
    const updated: GuildConfig = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };

    this.guildCache.set(guildId, updated);
    this.scheduleSave();
    return { ...updated };
  }

  public async delete(guildId: string): Promise<void> {
    if (this.guildCache.delete(guildId)) {
      this.scheduleSave();
    }
  }

  public async getUser(userId: string): Promise<UserConfig> {
    const existing = this.userCache.get(userId);
    if (existing) {
      return { ...existing };
    }

    const defaultUser: UserConfig = {
      userId,
      lastfmUsername: null,
      scrobbleEnabled: false,
      updatedAt: Date.now(),
    };

    this.userCache.set(userId, defaultUser);
    this.scheduleSave();
    return { ...defaultUser };
  }

  public async updateUser(userId: string, partial: UserConfigUpdate): Promise<UserConfig> {
    const current = await this.getUser(userId);
    const updated: UserConfig = {
      ...current,
      ...partial,
      updatedAt: Date.now(),
    };

    this.userCache.set(userId, updated);
    this.scheduleSave();
    return { ...updated };
  }

  public async flush(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    if (this.isDirty) {
      await this.saveToFile();
    }
  }

  private scheduleSave(): void {
    this.isDirty = true;
    if (this.saveTimeout) return;

    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      void this.saveToFile();
    }, 1000);
  }

  private async saveToFile(): Promise<void> {
    try {
      const data: StorageSchema = {
        guilds: Object.fromEntries(this.guildCache.entries()),
        users: Object.fromEntries(this.userCache.entries()),
      };
      const tempPath = `${this.filePath}.tmp`;
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      await fs.rename(tempPath, this.filePath);
      this.isDirty = false;
    } catch (err) {
      console.error('Error guardando base de datos JSON:', err);
    }
  }
}
