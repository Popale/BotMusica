import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const STAGING_DIR = path.join(ROOT_DIR, 'release_staging');
const ZIP_PATH = path.join(ROOT_DIR, 'DiscordMusicBot-v1.0.0.zip');

console.log('🚀 Preparing release package...');

// 1. Clean previous staging
await fs.rm(STAGING_DIR, { recursive: true, force: true });
await fs.rm(ZIP_PATH, { force: true });
await fs.mkdir(STAGING_DIR, { recursive: true });

// 2. Copy source code & configurations
await fs.cp(path.join(ROOT_DIR, 'src'), path.join(STAGING_DIR, 'src'), { recursive: true });
await fs.copyFile(path.join(ROOT_DIR, 'package.json'), path.join(STAGING_DIR, 'package.json'));
await fs.copyFile(path.join(ROOT_DIR, 'package-lock.json'), path.join(STAGING_DIR, 'package-lock.json'));
await fs.copyFile(path.join(ROOT_DIR, 'tsconfig.json'), path.join(STAGING_DIR, 'tsconfig.json'));
await fs.copyFile(path.join(ROOT_DIR, 'README.md'), path.join(STAGING_DIR, 'README.md'));
await fs.copyFile(path.join(ROOT_DIR, 'LICENSE'), path.join(STAGING_DIR, 'LICENSE'));

// 3. Create Clean .env template directly inside the release package
const cleanEnvContent = `# ==========================================
# 🤖 Discord Music Bot Configuration (.env)
# ==========================================

# 1. Discord Bot Credentials (Required)
# Get your bot token and application client ID at:
# https://discord.com/developers/applications
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
CLIENT_ID=YOUR_BOT_CLIENT_ID_HERE

# 2. Development Guild ID (Optional)
# Leave blank for global slash command deployment across all servers
DEV_GUILD_ID=

# 3. Bot Default Preferences
DEFAULT_PREFIX=!
DEFAULT_LANGUAGE=en
DEFAULT_VOLUME=70
DEFAULT_THEME_COLOR="#fd5279"

# Enables Message Content Intent for prefix commands (!) and text channel requests.
# Remember to enable "Message Content Intent" in Discord Developer Portal > Bot > Privileged Gateway Intents!
ENABLE_MESSAGE_CONTENT=true

# 4. Spotify API Credentials (Optional - https://developer.spotify.com/dashboard)
# Fill these in if you want high-speed direct Spotify track, album & playlist resolution
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# 5. Last.fm API Credentials (Optional - https://www.last.fm/api)
# Fill these in if you want to enable automatic Last.fm scrobbling and profile sync
LASTFM_API_KEY=
LASTFM_SHARED_SECRET=
`;

await fs.writeFile(path.join(STAGING_DIR, '.env'), cleanEnvContent, 'utf-8');

// 4. Create ZIP using PowerShell Compress-Archive
console.log('📦 Compressing archive into DiscordMusicBot-v1.0.0.zip...');
const psCommand = `powershell -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

// 5. Cleanup staging directory
await fs.rm(STAGING_DIR, { recursive: true, force: true });

console.log(`✅ Success! Release package created at: ${ZIP_PATH}`);

