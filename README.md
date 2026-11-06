# 🎵 Advanced Discord Music Bot

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B%20%7C%2022%20%7C%2024-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.8%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Discord.js-v14.18-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js">
  <img src="https://img.shields.io/badge/DisTube-v5-fd5279?style=for-the-badge" alt="DisTube">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
</p>

A next-generation, high-performance Discord music bot built with **Discord.js v14**, **TypeScript**, and **DisTube 5**. Inspired by sleek modern interfaces like Listune, featuring interactive button controls, dynamic canvas-rendered waveform cards, dedicated zero-spam request channel, and native multi-language support.

---

## ✨ Key Features

- **🎮 Interactive Player UI:** 10+ tactile button controls (Play/Pause, Skip, Previous, Loop Song/Queue, Shuffle, Autoplay, Volume, Queue pagination).
- **🎨 Dynamic Canvas Music Cards:** Automatically generates 800x240 pixel banner cards with album art, soundwave visualizer, and custom guild accent color using `@napi-rs/canvas`.
- **📻 Dedicated Song Request Channel (`/setup`):** Creates a persistent 1-message player panel with live queue updates and **automatic zero-spam cleanup** (deletes all user messages and stray embeds).
- **🎛️ Real-Time Audio Filters:** 8D / 3D Audio, Bass Boost, Nightcore, Vaporwave, Surround, and Echo with instant dropdown menu selection.
- **🎵 Multi-Platform Streaming:** Full support for YouTube, Spotify (tracks, albums, playlists), and SoundCloud.
- **🌐 Multi-Language Localization (i18n):** Native dictionaries for English (`en`), Spanish (`es`), and Portuguese (`pt`) with per-guild switching (`/language`).
- **🎧 Advanced DJ Role System:** Restrict music management to a specific DJ role (`/dj set-role`) or toggle strict DJ-only mode (`/dj mode`).
- **📊 Last.fm Integration:** Per-user account linking (`/lastfm set-user`) with automated scrobbling and now-playing track sync.
- **⌨️ Hybrid Command Architecture:** Both modern Discord Slash commands (`/play`, `/skip`, etc.) and customizable Prefix commands (`!play`, `!skip`, etc.).
- **🛡️ Production-Grade Code:** Strict TypeScript (0 `any`), $O(1)$ in-memory caching with atomic JSON disk persistence, and fail-fast environment validation.

---

## 📋 Requirements

- **Node.js 18.0.0 or higher** (Tested on Node 22 & 24)
- **Discord Bot Token & Application Client ID**
- **Privileged Gateway Intents enabled** in the [Discord Developer Portal](https://discord.com/developers/applications):
  1. Go to your application in the Developer Portal.
  2. Click **Bot** in the left menu.
  3. Scroll down to **Privileged Gateway Intents**.
  4. Enable **Message Content Intent** (and Server Members Intent if desired).
  5. Click **Save Changes**.

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Open the `.env` file in the root directory and configure your credentials:
```env
# Discord Credentials (Required)
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
CLIENT_ID=YOUR_BOT_CLIENT_ID_HERE

# Development Server ID (Optional: leave blank for global slash commands)
DEV_GUILD_ID=

# Bot Defaults
DEFAULT_PREFIX=!
DEFAULT_LANGUAGE=en
DEFAULT_VOLUME=70
DEFAULT_THEME_COLOR="#fd5279"
ENABLE_MESSAGE_CONTENT=true

# Spotify Credentials (Optional - for full Spotify URL support)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Last.fm Credentials (Optional - for scrobbling)
LASTFM_API_KEY=
LASTFM_SHARED_SECRET=
```

### 3. Deploy Slash Commands
Register all Slash commands globally with Discord:
```bash
npm run deploy
```

### 4. Build and Start the Bot

**Development Mode (Live Reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

---

## 📜 Commands List

### 🎵 Music Commands
| Slash Command | Prefix | Description |
| :--- | :--- | :--- |
| `/play <song>` | `!play <song>` | Search & play music or playlists from YouTube, Spotify, or SoundCloud |
| `/skip` | `!skip`, `!s` | Skip to the next track in queue |
| `/pause` | `!pause` | Pause current playback |
| `/resume` | `!resume`, `!r` | Resume playback |
| `/stop` | `!stop` | Stop playback, clear queue, and leave voice channel |
| `/queue [page]` | `!queue` | View upcoming tracks with interactive pagination buttons |
| `/nowplaying` | `!np` | Display current track card with live progress and controls |
| `/volume <1-100>` | `!vol <1-100>` | Adjust playback volume level |
| `/loop <mode>` | `!loop` | Set loop mode (`Off`, `Repeat Song`, `Repeat Queue`) |
| `/shuffle` | `!shuffle` | Randomly shuffle all upcoming songs in queue |
| `/seek <time>` | `!seek` | Seek to a specific timestamp (e.g. `01:45`) |
| `/autoplay` | `!autoplay` | Toggle automated smart song autoplay |
| `/filters` | `!filters` | Open real-time equalizer & audio filters menu |
| `/setup [channel]` | — | Configure dedicated zero-spam persistent request channel |

### ⚙️ Management & Utility Commands
| Slash Command | Description |
| :--- | :--- |
| `/dj set-role <role>` | Assign server's DJ role for protected music operations |
| `/dj mode <only_dj/everyone>` | Toggle strict DJ mode or free mode |
| `/dj clear` | Remove DJ role restriction |
| `/theme <hex_color>` | Change bot embed & canvas accent color (e.g. `#fd5279`) |
| `/language <en/es/pt>` | Set server bot interface language |
| `/lastfm set-user <username>` | Link personal Last.fm profile for scrobbling |
| `/lastfm toggle` | Enable or disable automatic Last.fm scrobbling |
| `/ping` | Check bot latency and Discord API heartbeat |
| `/help` | Interactive command directory and usage guide |

---

## 📁 Project Architecture

```
BotMusica/
├── .env                              # Environment configuration
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # TypeScript compiler configuration
├── src/
│   ├── index.ts                      # Application bootstrap & entry point
│   ├── deploy.ts                     # Slash commands deployer script
│   ├── client/
│   │   └── BotClient.ts              # Extended Client with DisTube & repos
│   ├── config/
│   │   └── env.ts                    # Zod-validated environment config
│   ├── commands/                     # Modular Slash & Prefix commands
│   │   ├── music/                    # Player, queue, setup, filters, etc.
│   │   ├── dj/                       # DJ role administration
│   │   └── general/                  # Help, theme, language, Last.fm
│   ├── events/                       # Discord & DisTube event listeners
│   │   ├── discordEvents.ts          # Ready, interaction handling
│   │   ├── messageEvents.ts          # Prefix commands & request channel input
│   │   └── musicEvents.ts            # DisTube playback lifecycle
│   ├── interactions/                 # Component handlers
│   │   ├── buttons/                  # Player button row clicks
│   │   └── selectMenus/              # Filter & recommendation menus
│   ├── music/                        # Music engine modules
│   │   ├── MusicEmbeds.ts            # Embed builders & button rows
│   │   ├── requestChannelManager.ts  # 1-Message persistent panel lifecycle
│   │   └── card/musicCardGenerator.ts# @napi-rs/canvas visualizer cards
│   ├── database/                     # Persistence layer
│   │   └── repositories/             # Atomic JSON repository with O(1) cache
│   └── i18n/                         # Localization engine (EN, ES, PT)
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
