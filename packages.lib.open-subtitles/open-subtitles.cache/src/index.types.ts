import type { OpenSubtitles } from '@get-subtext/lib.open-subtitles';
import type { Cache } from '@studio-75/lib.cache';

export interface CacheOpenSubtitlesConfig {
  ttl: number;
}

export interface CacheOpenSubtitlesOptions {
  config: CacheOpenSubtitlesConfig;
  instance: OpenSubtitles;
  cache: Cache;
}
