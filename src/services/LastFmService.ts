import { env } from '../config/env.js';

export interface RecentTrackInfo {
  track: string;
  artist: string;
  album: string;
  imageUrl?: string;
  isNowPlaying: boolean;
}

export class LastFmService {
  private static readonly BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

  public static isConfigured(): boolean {
    return Boolean(env.lastfmApiKey);
  }

  public static async getRecentTrack(username: string): Promise<RecentTrackInfo | null> {
    if (!this.isConfigured()) return null;

    try {
      const url = new URL(this.BASE_URL);
      url.searchParams.set('method', 'user.getrecenttracks');
      url.searchParams.set('user', username);
      url.searchParams.set('api_key', env.lastfmApiKey);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '1');

      const response = await fetch(url.toString());
      if (!response.ok) return null;

      const data = (await response.json()) as {
        recenttracks?: {
          track?: Array<{
            name: string;
            artist: { '#text': string };
            album: { '#text': string };
            image?: Array<{ '#text': string }>;
            '@attr'?: { nowplaying: string };
          }>;
        };
      };

      const track = data.recenttracks?.track?.[0];
      if (!track) return null;

      const images = track.image || [];
      const bestImage = images.length > 0 ? images[images.length - 1]['#text'] : undefined;

      return {
        track: track.name,
        artist: track.artist['#text'],
        album: track.album['#text'],
        imageUrl: bestImage || undefined,
        isNowPlaying: track['@attr']?.nowplaying === 'true',
      };
    } catch (error) {
      console.error('Error al consultar Last.fm:', error);
      return null;
    }
  }
}

