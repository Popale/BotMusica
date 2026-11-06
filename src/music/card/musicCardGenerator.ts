import { createCanvas, loadImage } from '@napi-rs/canvas';

interface CardOptions {
  title: string;
  artist: string;
  coverUrl?: string | null;
  themeColor?: string;
  sourceName?: string;
}

type Canvas2DContext = ReturnType<ReturnType<typeof createCanvas>['getContext']>;

export async function generateMusicCard(options: CardOptions): Promise<Buffer> {
  const width = 800;
  const height = 240;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const themeHex = options.themeColor || '#FD5279';

  // 1. Sleek Gradient Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#15131A');
  gradient.addColorStop(0.5, '#221422');
  gradient.addColorStop(1, '#1A0C16');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Glowing Accent Border & Highlights
  const accentGlow = ctx.createRadialGradient(width * 0.7, height * 0.5, 20, width * 0.7, height * 0.5, 300);
  accentGlow.addColorStop(0, `${themeHex}44`);
  accentGlow.addColorStop(1, '#00000000');
  ctx.fillStyle = accentGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Decorative Music Waveforms in the Background
  ctx.fillStyle = `${themeHex}33`;
  const barCount = 36;
  const barWidth = 8;
  const startX = 260;
  for (let i = 0; i < barCount; i++) {
    const waveHeight = Math.sin(i * 0.45) * 45 + 50;
    const x = startX + i * 14;
    const y = height / 2 - waveHeight / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, waveHeight, 4);
    ctx.fill();
  }

  // 4. Album Cover Artwork (with rounded corners)
  const coverSize = 180;
  const coverX = 30;
  const coverY = 30;

  try {
    if (options.coverUrl) {
      const img = await loadImage(options.coverUrl);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(coverX, coverY, coverSize, coverSize, 18);
      ctx.clip();
      ctx.drawImage(img, coverX, coverY, coverSize, coverSize);
      ctx.restore();

      // Border outline for cover
      ctx.strokeStyle = `${themeHex}88`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(coverX, coverY, coverSize, coverSize, 18);
      ctx.stroke();
    } else {
      drawFallbackCover(ctx, coverX, coverY, coverSize, themeHex);
    }
  } catch {
    drawFallbackCover(ctx, coverX, coverY, coverSize, themeHex);
  }

  // 5. Track Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px sans-serif';
  const cleanTitle = options.title.length > 28 ? `${options.title.slice(0, 26)}...` : options.title;
  ctx.fillText(cleanTitle, 245, 95);

  // 6. Artist / Author
  ctx.fillStyle = themeHex;
  ctx.font = '600 22px sans-serif';
  const cleanArtist = options.artist.length > 32 ? `${options.artist.slice(0, 30)}...` : options.artist;
  ctx.fillText(`🎤 ${cleanArtist} ♪`, 245, 140);

  // 7. Source Badge (Spotify, YouTube, SoundCloud)
  const source = options.sourceName || 'Discord Music';
  ctx.fillStyle = '#FFFFFF88';
  ctx.font = '16px sans-serif';
  ctx.fillText(`..:: ${source}`, 245, 180);

  return canvas.toBuffer('image/png');
}

function drawFallbackCover(
  ctx: Canvas2DContext,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  ctx.save();
  ctx.fillStyle = '#2A2030';
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 18);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', x + size / 2, y + size / 2 + 16);
  ctx.restore();
}
