import type { Omdb } from '@get-subtext/lib.omdb';
import type { Cache } from '@studio-75/lib.cache';

export interface CacheOmdbConfig {
  ttl: number;
}

export interface CacheOmdbOptions {
  config: CacheOmdbConfig;
  instance: Omdb;
  cache: Cache;
}
