import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';

async function generateCover() {
  const width = 2048;
  const height = 1024;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // ================= 1. BACKGROUND =================
  // Deep space dark gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a0910');
  bgGrad.addColorStop(0.5, '#130d1d');
  bgGrad.addColorStop(1, '#0c0712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Radiant Glowing Orbs (Top Left Pink & Bottom Right Purple/Cyan)
  const glow1 = ctx.createRadialGradient(250, 150, 50, 300, 200, 700);
  glow1.addColorStop(0, 'rgba(253, 82, 121, 0.28)');
  glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(1650, 850, 50, 1600, 800, 800);
  glow2.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
  glow2.addColorStop(0.6, 'rgba(88, 101, 242, 0.12)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Subtle Decorative Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // ================= 2. LEFT SIDE: BRANDING & TITLE =================
  const leftX = 100;

  // Badge: TypeScript & Discord.js v14
  ctx.save();
  ctx.fillStyle = 'rgba(253, 82, 121, 0.15)';
  ctx.strokeStyle = '#FD5279';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(leftX, 130, 390, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FD5279';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('⚡ DISCORD.JS V14 • TYPESCRIPT', leftX + 28, 161);
  ctx.restore();

  // Main Header Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 86px sans-serif';
  ctx.fillText('DISCORD', leftX, 275);

  // Gradient Text for "MUSIC BOT"
  const textGrad = ctx.createLinearGradient(leftX, 0, leftX + 500, 0);
  textGrad.addColorStop(0, '#FD5279');
  textGrad.addColorStop(0.6, '#C084FC');
  textGrad.addColorStop(1, '#60A5FA');
  ctx.fillStyle = textGrad;
  ctx.fillText('MUSIC BOT', leftX, 365);

  // Subtitle
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 28px sans-serif';
  ctx.fillText('Interactive player embeds with tactile buttons,', leftX, 425);
  ctx.fillText('canvas music cards, DJ roles & multi-language.', leftX, 465);

  // Feature Badges Grid (2 columns x 3 rows)
  const features = [
    { icon: '🕹️', text: 'Button Controls UI' },
    { icon: '🎨', text: 'Canvas Banner Cards' },
    { icon: '🛡️', text: 'Server DJ Role System' },
    { icon: '🎧', text: '8D & Bassboost Filters' },
    { icon: '🌐', text: 'Multi-Language (ES/EN/PT)' },
    { icon: '📻', text: 'Spotify, YT & SoundCloud' },
  ];

  const pillW = 390;
  const pillH = 58;
  const startY = 530;

  features.forEach((feat, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const px = leftX + col * (pillW + 20);
    const py = startY + row * (pillH + 18);

    ctx.save();
    ctx.fillStyle = 'rgba(30, 27, 45, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(px, py, pillW, pillH, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText(`${feat.icon}  ${feat.text}`, px + 22, py + 37);
    ctx.restore();
  });

  // Bottom Pill Bar
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(leftX, 810, 800, 54, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '600 20px sans-serif';
  ctx.fillText('🚀 Slash Commands ( / )  +  Hybrid Prefix ( ! )  +  Request Channel', leftX + 24, 844);
  ctx.restore();

  // ================= 3. RIGHT SIDE: DISCORD EMBED MOCKUP =================
  const mockX = 1010;
  const mockY = 120;
  const mockW = 930;
  const mockH = 780;

  // Discord Window Card
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 20;

  ctx.fillStyle = '#1e1f22';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mockX, mockY, mockW, mockH, 24);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Discord Window Top Bar (Avatar + Bot Tag)
  const headY = mockY + 45;
  // Bot Avatar Circle
  ctx.fillStyle = '#FD5279';
  ctx.beginPath();
  ctx.arc(mockX + 55, headY, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', mockX + 55, headY + 8);

  // Bot Name + APP Badge
  ctx.textAlign = 'left';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Listune', mockX + 96, headY - 2);

  // App Badge
  ctx.fillStyle = '#5865F2';
  ctx.beginPath();
  ctx.roundRect(mockX + 195, headY - 20, 62, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('✔ APP', mockX + 203, headY - 2);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '16px sans-serif';
  ctx.fillText('Today at 2:05 AM', mockX + 270, headY - 2);

  // Embed Container Box
  const embX = mockX + 45;
  const embY = mockY + 95;
  const embW = mockW - 90;
  const embH = mockH - 125;

  ctx.save();
  ctx.fillStyle = '#2b2d31';
  ctx.beginPath();
  ctx.roundRect(embX, embY, embW, embH, 16);
  ctx.fill();

  // Pink Left Highlight Border (Listune Style)
  ctx.fillStyle = '#FD5279';
  ctx.beginPath();
  ctx.roundRect(embX, embY, 8, embH, [16, 0, 0, 16]);
  ctx.fill();
  ctx.restore();

  // Embed Content
  const inX = embX + 35;
  let curY = embY + 42;

  // Header "Now Playing"
  ctx.fillStyle = '#FD5279';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('💿 Now Playing', inX, curY);

  curY += 38;
  // Song Title (Cyan Link)
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('All The Stars (From "Black Panther") - Kendrick Lamar', inX, curY);

  curY += 36;
  // Metadata Fields
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '600 20px sans-serif';
  ctx.fillText('🎤 Kendrick Lamar, SZA ♪', inX, curY);
  ctx.fillText('🔊 100%', inX + 360, curY);

  curY += 30;
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 19px sans-serif';
  ctx.fillText('⏱️ 03:55', inX, curY);
  ctx.fillStyle = '#FD5279';
  ctx.fillText('..:: Spotify', inX + 360, curY);

  // Mini Banner Artwork inside embed (Canvas Card Mockup)
  curY += 26;
  const artH = 140;
  ctx.save();
  const artGrad = ctx.createLinearGradient(inX, curY, inX + embW - 65, curY);
  artGrad.addColorStop(0, '#2D1426');
  artGrad.addColorStop(0.5, '#451838');
  artGrad.addColorStop(1, '#230E20');
  ctx.fillStyle = artGrad;
  ctx.beginPath();
  ctx.roundRect(inX, curY, embW - 70, artH, 14);
  ctx.fill();

  // Mini Art Thumbnail
  ctx.fillStyle = '#FD5279';
  ctx.beginPath();
  ctx.roundRect(inX + 18, curY + 18, 104, 104, 12);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎧', inX + 70, curY + 84);

  // Artwork Text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('All The Stars', inX + 145, curY + 58);
  ctx.fillStyle = '#FD5279';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('KENDRICK LAMAR ! SZA', inX + 145, curY + 92);

  // Waveform bars
  for (let b = 0; b < 24; b++) {
    const bh = Math.sin(b * 0.5) * 28 + 35;
    ctx.fillStyle = 'rgba(253, 82, 121, 0.45)';
    ctx.beginPath();
    ctx.roundRect(inX + 440 + b * 13, curY + 70 - bh / 2, 7, bh, 3);
    ctx.fill();
  }
  ctx.restore();

  // Dropdown 1: Recommended Tracks
  curY += artH + 20;
  const dropW = embW - 70;
  const dropH = 46;

  ctx.save();
  ctx.fillStyle = '#1e1f22';
  ctx.strokeStyle = '#383a40';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(inX, curY, dropW, dropH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '18px sans-serif';
  ctx.fillText('✨ Recommended For You', inX + 18, curY + 29);
  ctx.fillText('▾', inX + dropW - 32, curY + 30);
  ctx.restore();

  // Dropdown 2: Audio Filters
  curY += dropH + 12;
  ctx.save();
  ctx.fillStyle = '#1e1f22';
  ctx.strokeStyle = '#383a40';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(inX, curY, dropW, dropH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '18px sans-serif';
  ctx.fillText('🎛️ Audio Filters & Equalizer (8D, Bassboost...)', inX + 18, curY + 29);
  ctx.fillText('▾', inX + dropW - 32, curY + 30);
  ctx.restore();

  // Interactive Button Rows
  curY += dropH + 16;
  const btnRow1 = ['🔀 Shuffle', '⏮️ Previous', '⏸️ Pause', '⏭️ Skip', '🔁 Loop'];
  const btnW = (dropW - 4 * 10) / 5;
  const btnH = 44;

  btnRow1.forEach((label, i) => {
    const bx = inX + i * (btnW + 10);
    ctx.save();
    const isPrimary = label.includes('Pause');
    ctx.fillStyle = isPrimary ? '#FD5279' : '#383a40';
    ctx.beginPath();
    ctx.roundRect(bx, curY, btnW, btnH, 8);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, bx + btnW / 2, curY + 28);
    ctx.restore();
  });

  curY += btnH + 10;
  const btnRow2 = ['📻 Autoplay', '🔉 Vol -', '⏹️ Stop', '🔊 Vol +', '📜 Queue'];
  btnRow2.forEach((label, i) => {
    const bx = inX + i * (btnW + 10);
    ctx.save();
    const isDanger = label.includes('Stop');
    ctx.fillStyle = isDanger ? '#EF4444' : '#383a40';
    ctx.beginPath();
    ctx.roundRect(bx, curY, btnW, btnH, 8);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, bx + btnW / 2, curY + 28);
    ctx.restore();
  });

  // Save to file
  const outPath = path.resolve(process.cwd(), 'cover_image.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Cover image generated successfully: ${outPath} (${width}x${height})`);
}

generateCover().catch(console.error);

