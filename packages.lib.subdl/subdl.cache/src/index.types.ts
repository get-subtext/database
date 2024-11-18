import type { Subdl } from '@get-subtext/lib.subdl';
import type { Cache } from '@studio-75/lib.cache';

export interface CacheSubdlConfig {
  ttl: number;
}

export interface CacheSubdlOptions {
  config: CacheSubdlConfig;
  instance: Subdl;
  cache: Cache;
}
