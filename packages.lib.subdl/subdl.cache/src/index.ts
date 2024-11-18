import type { Subdl } from '@get-subtext/lib.subdl';
import type { CacheSubdlOptions } from './index.types';
import { CacheSubdl } from './services/CacheSubdl';

export type * from './index.types';

export class CacheSubdlFactory {
  private constructor() {}

  public static create({ config, instance, cache }: CacheSubdlOptions): Subdl {
    return new CacheSubdl(config.ttl, instance, cache);
  }
}
