import type { OpenSubtitles } from '@get-subtext/lib.open-subtitles';
import type { FetchOpenSubtitlesOptions } from './index.types';
import { FetchOpenSubtitles } from './services/FetchOpenSubtitles';
import { FetchOpenSubtitlesInternal } from './services/FetchOpenSubtitlesInternal';

export type * from './index.types';

export class FetchOpenSubtitlesFactory {
  private constructor() {}

  public static create({ config, fetch }: FetchOpenSubtitlesOptions): OpenSubtitles {
    const fetchOpenSubtitlesInternal = new FetchOpenSubtitlesInternal(config.apiKey, config.apiUrlBase, fetch);
    return new FetchOpenSubtitles(fetchOpenSubtitlesInternal);
  }
}
