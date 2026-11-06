import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required in .env'),
  CLIENT_ID: z.string().min(1, 'CLIENT_ID is required in .env'),
  DEV_GUILD_ID: z.string().optional().default(''),
  DEFAULT_PREFIX: z.string().min(1).max(5).default('!'),
  DEFAULT_LANGUAGE: z.enum(['es', 'en', 'pt']).default('es'),
  DEFAULT_VOLUME: z.coerce.number().min(1).max(100).default(70),
  DEFAULT_THEME_COLOR: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return '#FD5279';
      if (/^#[0-9a-fA-F]{6,8}$/.test(val)) {
        return val.slice(0, 7);
      }
      return '#FD5279';
    }),
  ENABLE_MESSAGE_CONTENT: z
    .string()
    .optional()
    .default('true')
    .transform((val) => val === 'true' || val === '1'),
  SPOTIFY_CLIENT_ID: z.string().optional().default(''),
  SPOTIFY_CLIENT_SECRET: z.string().optional().default(''),
  LASTFM_API_KEY: z.string().optional().default(''),
  LASTFM_SHARED_SECRET: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => ` - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(`❌ Error en la configuración del archivo .env:\n${formattedErrors}`);
  process.exit(1);
}

export interface AppConfig {
  discordToken: string;
  clientId: string;
  devGuildId: string;
  defaultPrefix: string;
  defaultLanguage: 'es' | 'en' | 'pt';
  defaultVolume: number;
  defaultThemeColor: string;
  enableMessageContent: boolean;
  spotifyClientId: string;
  spotifyClientSecret: string;
  lastfmApiKey: string;
  lastfmSharedSecret: string;
}

export const env: AppConfig = {
  discordToken: parsed.data.DISCORD_TOKEN,
  clientId: parsed.data.CLIENT_ID,
  devGuildId: parsed.data.DEV_GUILD_ID,
  defaultPrefix: parsed.data.DEFAULT_PREFIX,
  defaultLanguage: parsed.data.DEFAULT_LANGUAGE,
  defaultVolume: parsed.data.DEFAULT_VOLUME,
  defaultThemeColor: parsed.data.DEFAULT_THEME_COLOR,
  enableMessageContent: parsed.data.ENABLE_MESSAGE_CONTENT,
  spotifyClientId: parsed.data.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: parsed.data.SPOTIFY_CLIENT_SECRET,
  lastfmApiKey: parsed.data.LASTFM_API_KEY,
  lastfmSharedSecret: parsed.data.LASTFM_SHARED_SECRET,
};
