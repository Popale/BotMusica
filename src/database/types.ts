export type DjMode = 'only_dj' | 'everyone';
export type SupportedLanguage = 'es' | 'en' | 'pt';

export interface GuildConfig {
  guildId: string;
  prefix: string;
  language: SupportedLanguage;
  djRoleId: string | null;
  djMode: DjMode;
  defaultVolume: number;
  themeColor: string;
  requestChannelId: string | null;
  requestMessageId: string | null;
  updatedAt: number;
}

export type GuildConfigUpdate = Partial<Omit<GuildConfig, 'guildId' | 'updatedAt'>>;

export interface UserConfig {
  userId: string;
  lastfmUsername: string | null;
  scrobbleEnabled: boolean;
  updatedAt: number;
}

export type UserConfigUpdate = Partial<Omit<UserConfig, 'userId' | 'updatedAt'>>;
