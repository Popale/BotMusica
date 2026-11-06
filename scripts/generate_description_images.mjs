import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_DIR = path.resolve(process.cwd(), 'description_images');
await fs.mkdir(OUTPUT_DIR, { recursive: true });

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

// -------------------------------------------------------------
// 1. BANNER 1: INTERACTIVE PLAYER & CANVAS MUSIC CARDS (960 x 540)
// -------------------------------------------------------------
async function createPlayerBanner() {
  const width = 960;
  const height = 540;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background Dark Theme
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0b12');
  bgGrad.addColorStop(0.5, '#121422');
  bgGrad.addColorStop(1, '#0c0d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Ambient Glow
  const glow = ctx.createRadialGradient(260, 280, 20, 260, 280, 400);
  glow.addColorStop(0, 'rgba(253, 82, 121, 0.22)');
  glow.addColorStop(1, 'rgba(253, 82, 121, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Subtle Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();

  // Header Pill Badge
  ctx.fillStyle = 'rgba(253, 82, 121, 0.15)';
  roundRect(ctx, 40, 32, 165, 26, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(253, 82, 121, 0.45)';
  ctx.lineWidth = 1;
  roundRect(ctx, 40, 32, 165, 26, 13);
  ctx.stroke();

  ctx.fillStyle = '#fd5279';
  ctx.font = 'bold 11px "Segoe UI", sans-serif';
  ctx.fillText('DISCORD PLAYER UI', 56, 49);

  // Main Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.fillText('Interactive Music Player & Dynamic Cards', 40, 88);

  ctx.fillStyle = '#949ba4';
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Canvas-rendered waveforms, instant tactile buttons & genre recommendations', 40, 112);

  // Left: Real Discord Player UI Preview
  const playerImgPath = 'C:/Users/alejo/.gemini/antigravity/brain/6ca3a5db-b3bf-4389-91e4-0665b795ba2f/.user_uploaded/media_1793946165330_719e3e0a.png';
  try {
    const playerImg = await loadImage(playerImgPath);
    const cardX = 40;
    const cardY = 136;
    const cardW = 490;
    const cardH = 370;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#1e1f22';
    roundRect(ctx, cardX, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundRect(ctx, cardX, cardY, cardW, cardH, 12);
    ctx.clip();
    ctx.drawImage(playerImg, 0, 0, playerImg.width, playerImg.height, cardX, cardY, cardW, cardH);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cardX, cardY, cardW, cardH, 12);
    ctx.stroke();
  } catch (err) {
    console.error('Player img load error:', err);
  }

  // Right Side: Feature Highlight Cards
  const features = [
    {
      icon: '🎨',
      title: 'Canvas-Generated Cards',
      desc: 'Automatic 800x240 banner with album cover, wave visualizer, and custom accent color.',
    },
    {
      icon: '🎛️',
      title: 'Tactile Button Controls',
      desc: 'Play/Pause, Skip, Previous, Loop (Song/Queue), Shuffle, Autoplay, and Volume.',
    },
    {
      icon: '⚡',
      title: 'Equalizer & Audio Filters',
      desc: 'Select menu with 8D Audio, Bass Boost, Nightcore, Vaporwave, Surround, and Echo.',
    },
    {
      icon: '✨',
      title: 'Smart Recommendations',
      desc: '1-click dropdown to instantly play trending Pop, Lo-Fi, Hip-Hop, Rock, and Synthwave.',
    },
  ];

  let fy = 138;
  for (const f of features) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    roundRect(ctx, 555, fy, 365, 82, 10);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    roundRect(ctx, 555, fy, 365, 82, 10);
    ctx.stroke();

    ctx.fillStyle = 'rgba(253, 82, 121, 0.12)';
    roundRect(ctx, 568, fy + 17, 48, 48, 8);
    ctx.fill();
    ctx.font = '22px "Segoe UI Emoji", sans-serif';
    ctx.fillText(f.icon, 580, fy + 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText(f.title, 628, fy + 34);

    ctx.fillStyle = '#949ba4';
    ctx.font = '12px "Segoe UI", sans-serif';
    const words = f.desc.split(' ');
    let line1 = '';
    let line2 = '';
    for (const w of words) {
      if ((line1 + w).length < 44) line1 += w + ' ';
      else line2 += w + ' ';
    }
    ctx.fillText(line1.trim(), 628, fy + 53);
    if (line2) ctx.fillText(line2.trim(), 628, fy + 69);

    fy += 94;
  }

  const outPath = path.join(OUTPUT_DIR, 'showcase_player.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Saved:', outPath);
}

// -------------------------------------------------------------
// 2. BANNER 2: DEDICATED REQUEST CHANNEL (/setup) (960 x 540)
// -------------------------------------------------------------
async function createRequestBanner() {
  const width = 960;
  const height = 540;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0d14');
  bgGrad.addColorStop(0.5, '#0e1526');
  bgGrad.addColorStop(1, '#090d16');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Cyan & Pink Radial Glow
  const glow = ctx.createRadialGradient(280, 270, 20, 280, 270, 380);
  glow.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
  glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();

  // Header Pill
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  roundRect(ctx, 40, 32, 180, 26, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1;
  roundRect(ctx, 40, 32, 180, 26, 13);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 11px "Segoe UI", sans-serif';
  ctx.fillText('REQUEST CHANNEL SYSTEM', 52, 49);

  // Main Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.fillText('Dedicated Song Request Channel (/setup)', 40, 88);

  ctx.fillStyle = '#949ba4';
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Clean single-message persistent player panel with live queue & auto-cleanup', 40, 112);

  // Left: Discord Request Panel Mockup Box
  const panelX = 40;
  const panelY = 136;
  const panelW = 490;
  const panelH = 370;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#1e1f22';
  roundRect(ctx, panelX, panelY, panelW, panelH, 12);
  ctx.fill();
  ctx.restore();

  // Inside Embed Container
  ctx.fillStyle = '#2b2d31';
  roundRect(ctx, panelX + 16, panelY + 16, panelW - 32, panelH - 92, 10);
  ctx.fill();

  // Left Colored Strip
  ctx.fillStyle = '#fd5279';
  roundRect(ctx, panelX + 16, panelY + 16, 5, panelH - 92, 2);
  ctx.fill();

  // Title inside embed
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "Segoe UI", sans-serif';
  ctx.fillText('🎶 Join a voice channel and play songs using name or URL in here!', panelX + 32, panelY + 44);

  // Status & Track Details
  ctx.fillStyle = '#fd5279';
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillText('💿 NOW PLAYING', panelX + 32, panelY + 74);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.fillText('All The Stars (with SZA) - Kendrick Lamar', panelX + 32, panelY + 98);

  ctx.fillStyle = '#dbdee1';
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillText('🎤 Kendrick Lamar 🎵', panelX + 32, panelY + 124);
  ctx.fillText('⏱️ 03:52', panelX + 220, panelY + 124);
  ctx.fillText('🔊 100%', panelX + 32, panelY + 144);
  ctx.fillText('..:: Spotify', panelX + 220, panelY + 144);

  // Mini Album Cover inside embed
  ctx.fillStyle = '#111214';
  roundRect(ctx, panelX + panelW - 120, panelY + 56, 80, 80, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  roundRect(ctx, panelX + panelW - 120, panelY + 56, 80, 80, 8);
  ctx.stroke();
  ctx.font = '36px "Segoe UI Emoji", sans-serif';
  ctx.fillText('🎵', panelX + panelW - 102, panelY + 110);

  // Queue Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.moveTo(panelX + 32, panelY + 166);
  ctx.lineTo(panelX + panelW - 32, panelY + 166);
  ctx.stroke();

  // Songs in Queue
  ctx.fillStyle = '#b5bac1';
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillText('SONGS IN YOUR QUEUE:', panelX + 32, panelY + 188);

  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#dbdee1';
  ctx.fillText('1.  Kill Bill - SZA (02:33)', panelX + 32, panelY + 210);
  ctx.fillText('2.  Starboy - The Weeknd ft. Daft Punk (03:50)', panelX + 32, panelY + 230);
  ctx.fillText('3.  Blinding Lights - The Weeknd (03:20)', panelX + 32, panelY + 250);

  ctx.fillStyle = '#949ba4';
  ctx.font = '11px "Segoe UI", sans-serif';
  ctx.fillText('Tracks Left • 3 | Total Duration • 13:35', panelX + 32, panelY + 280);

  // 5 Action Buttons Bar
  const btnY = panelY + panelH - 62;
  const btnW = 86;
  const btnH = 38;
  const buttons = [
    { label: 'Stop', emoji: '⏹️', bg: '#da373c' },
    { label: 'Prev', emoji: '⏮️', bg: '#4e5058' },
    { label: 'Pause', emoji: '⏸️', bg: '#5865f2' },
    { label: 'Skip', emoji: '⏭️', bg: '#4e5058' },
    { label: 'Shuffle', emoji: '🔀', bg: '#4e5058' },
  ];

  let bx = panelX + 16;
  for (const b of buttons) {
    ctx.fillStyle = b.bg;
    roundRect(ctx, bx, btnY, btnW, btnH, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillText(`${b.emoji} ${b.label}`, bx + 16, btnY + 24);
    bx += btnW + 8;
  }

  // Right Side: Request Channel Feature Pills
  const reqFeatures = [
    {
      icon: '🧹',
      title: 'Strict 1-Message Guarantee',
      desc: 'Never clutters your server. The bot keeps exactly 1 message and auto-purges any stray chat.',
    },
    {
      icon: '⚡',
      title: 'Zero Prefix Required',
      desc: 'Users just type the song name or paste a YouTube/Spotify link directly in the channel.',
    },
    {
      icon: '🔄',
      title: 'Live Real-Time Sync',
      desc: 'The queue list, track duration, and controls refresh automatically with every event.',
    },
    {
      icon: '⏹️',
      title: 'Automatic Idle Reset',
      desc: 'When playback stops or finishes, the panel gracefully restores to empty without residue.',
    },
  ];

  let ry = 138;
  for (const f of reqFeatures) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    roundRect(ctx, 555, ry, 365, 82, 10);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    roundRect(ctx, 555, ry, 365, 82, 10);
    ctx.stroke();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    roundRect(ctx, 568, ry + 17, 48, 48, 8);
    ctx.fill();
    ctx.font = '22px "Segoe UI Emoji", sans-serif';
    ctx.fillText(f.icon, 580, ry + 48);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText(f.title, 628, ry + 34);

    ctx.fillStyle = '#949ba4';
    ctx.font = '12px "Segoe UI", sans-serif';
    const words = f.desc.split(' ');
    let line1 = '';
    let line2 = '';
    for (const w of words) {
      if ((line1 + w).length < 44) line1 += w + ' ';
      else line2 += w + ' ';
    }
    ctx.fillText(line1.trim(), 628, ry + 53);
    if (line2) ctx.fillText(line2.trim(), 628, ry + 69);

    ry += 94;
  }

  const outPath = path.join(OUTPUT_DIR, 'showcase_request.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Saved:', outPath);
}

// -------------------------------------------------------------
// 3. BANNER 3: ECOSYSTEM & ARCHITECTURE (960 x 480)
// -------------------------------------------------------------
async function createFeaturesGridBanner() {
  const width = 960;
  const height = 480;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0c0e17');
  bgGrad.addColorStop(0.5, '#121626');
  bgGrad.addColorStop(1, '#0e0f18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Purple & Rose Ambient Glow
  const glow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, 450);
  glow.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
  glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();

  // Header Pill
  ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
  roundRect(ctx, 40, 28, 175, 26, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
  ctx.lineWidth = 1;
  roundRect(ctx, 40, 28, 175, 26, 13);
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 11px "Segoe UI", sans-serif';
  ctx.fillText('FEATURE SPECIFICATIONS', 52, 45);

  // Main Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.fillText('Advanced Ecosystem & Performance Architecture', 40, 82);

  ctx.fillStyle = '#949ba4';
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillText('Everything you need for public communities, private guilds, and gaming servers', 40, 106);

  // 6 Features Grid (2 Rows x 3 Columns)
  const grid = [
    {
      icon: '🎵',
      title: 'Multi-Platform Audio',
      desc: 'Seamless streaming for YouTube, Spotify (tracks, albums, playlists) & SoundCloud.',
      tag: 'YouTube • Spotify • SoundCloud',
    },
    {
      icon: '🌐',
      title: 'Multi-Language (i18n)',
      desc: 'Instant localization with modular dictionaries in English (en), Spanish (es) & Portuguese (pt).',
      tag: 'EN • ES • PT Built-in',
    },
    {
      icon: '🎧',
      title: 'Advanced DJ System',
      desc: 'Role protection (/dj set-role) with strict DJ-only mode or free mode for casual servers.',
      tag: 'Strict & Free Modes',
    },
    {
      icon: '📊',
      title: 'Last.fm Scrobbler',
      desc: 'Link Last.fm accounts per-user to automatically track now-playing songs and scrobbles.',
      tag: 'Scrobble & Profile Sync',
    },
    {
      icon: '⌨️',
      title: 'Hybrid Slash & Prefix',
      desc: 'Full Discord slash command suite plus customizable prefix commands (!play, !skip, etc.).',
      tag: 'Slash + Prefix Ready',
    },
    {
      icon: '🛡️',
      title: 'Clean Architecture',
      desc: 'Strict TypeScript (0 any), O(1) in-memory cache, atomic JSON storage & zero memory leaks.',
      tag: 'TypeScript • Production-Ready',
    },
  ];

  const colW = 276;
  const rowH = 150;
  const startX = 40;
  const startY = 136;
  const gapX = 26;
  const gapY = 20;

  grid.forEach((item, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = startX + col * (colW + gapX);
    const y = startY + row * (rowH + gapY);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    roundRect(ctx, x, y, colW, rowH, 10);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, colW, rowH, 10);
    ctx.stroke();

    // Icon + Tag Row
    ctx.font = '22px "Segoe UI Emoji", sans-serif';
    ctx.fillText(item.icon, x + 16, y + 36);

    ctx.fillStyle = 'rgba(253, 82, 121, 0.12)';
    roundRect(ctx, x + colW - 142, y + 16, 126, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#fd5279';
    ctx.font = 'bold 10px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.tag, x + colW - 79, y + 31);
    ctx.textAlign = 'left';

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText(item.title, x + 16, y + 68);

    // Description (Wrap)
    ctx.fillStyle = '#949ba4';
    ctx.font = '12px "Segoe UI", sans-serif';
    const words = item.desc.split(' ');
    let line1 = '';
    let line2 = '';
    let line3 = '';
    for (const w of words) {
      if ((line1 + w).length < 34) line1 += w + ' ';
      else if ((line2 + w).length < 34) line2 += w + ' ';
      else line3 += w + ' ';
    }
    ctx.fillText(line1.trim(), x + 16, y + 90);
    if (line2) ctx.fillText(line2.trim(), x + 16, y + 107);
    if (line3) ctx.fillText(line3.trim(), x + 16, y + 124);
  });

  const outPath = path.join(OUTPUT_DIR, 'showcase_features.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Saved:', outPath);
}

// -------------------------------------------------------------
// 4. BANNER 4: HEADER HERO DIVIDER (960 x 240)
// -------------------------------------------------------------
async function createHeaderBanner() {
  const width = 960;
  const height = 240;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0c0d16');
  bgGrad.addColorStop(0.5, '#15172b');
  bgGrad.addColorStop(1, '#0e0f1a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Vivid Glowing Spotlights
  const glow1 = ctx.createRadialGradient(160, 120, 10, 160, 120, 260);
  glow1.addColorStop(0, 'rgba(253, 82, 121, 0.28)');
  glow1.addColorStop(1, 'rgba(253, 82, 121, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(800, 120, 10, 800, 120, 260);
  glow2.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  glow2.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, width - 2, height - 2, 16);
  ctx.stroke();

  // Music Waveform graphic on background
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < width; i += 12) {
    const barH = 20 + Math.sin(i * 0.05) * 16 + Math.cos(i * 0.02) * 12;
    ctx.moveTo(i, 120 - barH);
    ctx.lineTo(i, 120 + barH);
  }
  ctx.stroke();

  // Center Content
  ctx.textAlign = 'center';

  // Badge
  ctx.fillStyle = 'rgba(253, 82, 121, 0.16)';
  roundRect(ctx, width / 2 - 130, 28, 260, 28, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(253, 82, 121, 0.5)';
  ctx.lineWidth = 1;
  roundRect(ctx, width / 2 - 130, 28, 260, 28, 14);
  ctx.stroke();

  ctx.fillStyle = '#fd5279';
  ctx.font = 'bold 12px "Segoe UI", sans-serif';
  ctx.fillText('✨ PRODUCTION-READY DISCORD MUSIC BOT', width / 2, 46);

  // Big Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Segoe UI", sans-serif';
  ctx.fillText('Next-Gen Music Experience for Discord', width / 2, 94);

  // Subtitle
  ctx.fillStyle = '#949ba4';
  ctx.font = '15px "Segoe UI", sans-serif';
  ctx.fillText('Interactive Button Controls • Dynamic Canvas Cards • 1-Message Request Channel', width / 2, 126);

  // Pill Badges Row
  const pills = [
    { text: 'TypeScript', bg: 'rgba(49, 120, 198, 0.2)', border: 'rgba(49, 120, 198, 0.5)', color: '#60a5fa' },
    { text: 'Discord.js v14', bg: 'rgba(88, 101, 242, 0.2)', border: 'rgba(88, 101, 242, 0.5)', color: '#818cf8' },
    { text: 'DisTube 5', bg: 'rgba(253, 82, 121, 0.2)', border: 'rgba(253, 82, 121, 0.5)', color: '#fb7185' },
    { text: 'i18n (EN/ES/PT)', bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)', color: '#4ade80' },
    { text: 'Last.fm Scrobbler', bg: 'rgba(217, 35, 35, 0.2)', border: 'rgba(217, 35, 35, 0.5)', color: '#f87171' },
  ];

  const pillTotalW = pills.length * 130;
  let px = width / 2 - pillTotalW / 2 + 10;
  for (const p of pills) {
    ctx.fillStyle = p.bg;
    roundRect(ctx, px, 160, 120, 30, 8);
    ctx.fill();

    ctx.strokeStyle = p.border;
    ctx.lineWidth = 1;
    roundRect(ctx, px, 160, 120, 30, 8);
    ctx.stroke();

    ctx.fillStyle = p.color;
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillText(p.text, px + 60, 180);

    px += 130;
  }

  ctx.textAlign = 'left';

  const outPath = path.join(OUTPUT_DIR, 'showcase_header.png');
  await fs.writeFile(outPath, canvas.toBuffer('image/png'));
  console.log('Saved:', outPath);
}

await createPlayerBanner();
await createRequestBanner();
await createFeaturesGridBanner();
await createHeaderBanner();
console.log('All 4 description showcase images generated successfully!');
