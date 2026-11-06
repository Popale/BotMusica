# 🎵 Bot de Música Avanzado para Discord (Estilo Listune)

Bot de música de alta fidelidad para Discord inspirado en el diseño interactivo de **Listune**, desarrollado con **TypeScript**, **Discord.js v14**, **DisTube 5** y **Canvas**. Cuenta con embeds dinámicos, tarjeta musical personalizable generada al vuelo, soporte multi-idioma, integración con Last.fm, canal de peticiones dedicado, y compatibilidad con comandos por barra (`/`) y prefijo (`!`).

---

## 🌟 Nuevas Características Implementadas

1. **Embeds & Controles Avanzados (Estilo Listune):**
   - **Header:** `💿 Now Playing` con título enlazado y metadatos (`🎤 Artista 🎵`, `🔊 100%`, `⏱️ 03:55`, `..:: Spotify / Deezer / YouTube`).
   - **Menú Desplegable "Recommended For You":** Sugerencias rápidas por género (`Pop Hits`, `Lo-Fi Chill`, `Hip-Hop`, `Rock Classics`, `Electronic`) para añadir temas recomendados con 1 clic.
   - **Menú Desplegable "Audio Filters":** Aplicación y limpieza de efectos en tiempo real (8D / 3D, Bass Boost, Nightcore, Vaporwave, Eco).
   - **Filas de Botones Táctiles:**
     - Fila 1: `🔀 Aleatorio` | `⏮️ Anterior` | `⏸️ Pausar / ▶️ Reanudar` | `⏭️ Saltar` | `🔁 Repetir`
     - Fila 2: `📻 Autoplay` | `🔉 Vol -` | `⏹️ Detener` | `🔊 Vol +` | `📜 Ver Cola`
2. **Tarjeta de Música Generada con Canvas (`@napi-rs/canvas`):**
   - Banner horizontal estilizado generado en milisegundos con portada del álbum, bordes redondeados, ondas de audio decorativas y acento de color neón.
3. **Canal de Peticiones Dedicado (`/setup`):**
   - Crea un canal `#music-requests` con un panel interactivo persistente.
   - Los usuarios solo escriben el nombre o pegan el enlace en el canal y el bot reproduce la canción y limpia el mensaje automáticamente.
4. **Soporte Multi-Idioma (i18n):**
   - Soporte nativo para **Español (`es`)**, **Inglés (`en`)** y **Portugués (`pt`)**.
   - Cambia el idioma del servidor al instante con `/language <es|en|pt>`.
5. **Comandos Híbridos (Slash Commands y Prefijo):**
   - Usa `/play` o `!play`, `/skip` o `!skip`, `/queue` o `!q`.
   - Prefijo configurable por servidor con `!prefix <nuevo_prefijo>`.
6. **Soporte para Spotify Playlists y Álbumes:**
   - Soporte extendido para canciones, listas de reproducción y álbumes de Spotify a través de `@distube/spotify`.
7. **Integración con Last.fm:**
   - Vincula tu cuenta de Last.fm con `/lastfm set-user <usuario>`.
   - Consulta lo que estás escuchando o tu historial reciente con `/lastfm nowplaying`.
   - Activa o desactiva el scrobbling automático con `/lastfm scrobble <activo: true|false>`.
8. **Soporte para Servidores, DMs y Aplicación de Usuario (Discord Activity Contexts):**
   - Los comandos están registrados con contextos de instalación de servidor (`GuildInstall`) y usuario (`UserInstall`), permitiendo su uso tanto en servidores como en mensajes directos.
9. **Personalización de Tema Visual (`/theme`):**
   - Cambia el color de acento de los embeds y el banner: Listune Pink (`#FD5279`), Royal Purple (`#7209B7`), Blurple (`#5865F2`), Neon Cyan (`#00F5D4`), Sunset Gold (`#F77F00`) o Midnight (`#1E1E24`).

---

## 📁 Arquitectura del Código

```
BotMusica/
├── src/
│   ├── client/
│   │   └── BotClient.ts                    # Discord Client con DisTube, repositorios y partials
│   ├── config/
│   │   └── env.ts                          # Validación de entorno Zod fail-fast
│   ├── database/
│   │   ├── repositories/
│   │   │   ├── IGuildConfigRepository.ts   # Contrato de datos desacoplado
│   │   │   └── JsonGuildConfigRepository.ts# Persistencia atómica de servidores y usuarios
│   │   └── types.ts                        # Tipos de configuración y usuarios
│   ├── guards/
│   │   ├── voiceGuard.ts                   # Guard de canal de voz
│   │   └── djGuard.ts                      # Guard de rol DJ y permisos
│   ├── i18n/
│   │   ├── locales/                        # Diccionarios de idioma (es.ts, en.ts, pt.ts)
│   │   └── index.ts                        # Motor de traducción tipado
│   ├── music/
│   │   ├── card/
│   │   │   └── musicCardGenerator.ts       # Generador de banner con Canvas
│   │   ├── utils/
│   │   │   └── progressBar.ts              # Utilidades de duración y progreso
│   │   ├── MusicEmbeds.ts                  # Capa de presentación (Embeds, Select Menus, Botones)
│   │   └── types.ts
│   ├── commands/
│   │   ├── music/                          # play, skip, pause, resume, stop, nowplaying, queue,
│   │   │                                   # volume, loop, shuffle, seek, filters, autoplay, setup
│   │   ├── dj/                             # dj (set-role, remove-role, mode, status)
│   │   ├── general/                        # help, ping, language, theme, lastfm
│   │   └── index.ts
│   ├── interactions/
│   │   ├── buttons/                        # Handlers para botones de control
│   │   └── selectMenus/                    # Handlers para filtros y sugerencias
│   ├── events/
│   │   ├── discordEvents.ts                # Enrutador de interacciones
│   │   ├── messageEvents.ts                # Procesador de comandos con prefijo y canal de peticiones
│   │   └── musicEvents.ts                  # Eventos de DisTube (playSong con tarjeta Canvas, etc.)
│   ├── services/
│   │   └── LastFmService.ts                # Conexión con la API de Last.fm
│   ├── deploy.ts                           # Despliegue de comandos Slash con contextos Guild + DM
│   └── index.ts                            # Bootstrap y apagado seguro
├── .env                                    # Variables de entorno
└── package.json
```

---

## ⚙️ Configuración del archivo `.env`

Edita directamente el archivo `.env`:

```env
DISCORD_TOKEN=tu_token_aqui
CLIENT_ID=tu_client_id

# Opcional: ID de servidor para pruebas instantáneas
DEV_GUILD_ID=

# Configuración inicial del bot
DEFAULT_PREFIX=!
DEFAULT_LANGUAGE=es
DEFAULT_VOLUME=70
DEFAULT_THEME_COLOR="#FD5279"

# Credenciales de Spotify (Opcional)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Credenciales de Last.fm (Opcional)
LASTFM_API_KEY=
LASTFM_SHARED_SECRET=
```

---

## 🚀 Despliegue y Ejecución

1. **Registrar comandos Slash con soporte de Servidores y DMs:**
   ```powershell
   npm run deploy
   ```

2. **Iniciar en Desarrollo:**
   ```powershell
   npm run dev
   ```

3. **Compilar e Iniciar en Producción:**
   ```powershell
   npm run build
   npm start
   ```
