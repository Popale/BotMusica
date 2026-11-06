import { GuildConfig, GuildConfigUpdate, UserConfig, UserConfigUpdate } from '../types.js';

export interface IGuildConfigRepository {
  init(): Promise<void>;
  get(guildId: string): Promise<GuildConfig>;
  update(guildId: string, partial: GuildConfigUpdate): Promise<GuildConfig>;
  delete(guildId: string): Promise<void>;
  getUser(userId: string): Promise<UserConfig>;
  updateUser(userId: string, partial: UserConfigUpdate): Promise<UserConfig>;
  flush(): Promise<void>;
}
