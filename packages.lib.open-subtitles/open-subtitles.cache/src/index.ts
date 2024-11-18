import type { OpenSubtitles } from '@get-subtext/lib.open-subtitles';
import type { CacheOpenSubtitlesOptions } from './index.types';
import { CacheOpenSubtitles } from './services/CacheOpenSubtitles';

export type * from './index.types';

export class CacheOpenSubtitlesFactory {
  private constructor() {}

  public static create({ config, instance, cache }: CacheOpenSubtitlesOptions): OpenSubtitles {
    return new CacheOpenSubtitles(config.ttl, instance, cache);
  }
}
