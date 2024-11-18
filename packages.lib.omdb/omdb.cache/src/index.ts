import type { Omdb } from '@get-subtext/lib.omdb';
import type { CacheOmdbOptions } from './index.types';
import { CacheOmdb } from './services/CacheOmdb';

export type * from './index.types';

export class CacheOmdbFactory {
  private constructor() {}

  public static create({ config, instance, cache }: CacheOmdbOptions): Omdb {
    return new CacheOmdb(config.ttl, instance, cache);
  }
}
