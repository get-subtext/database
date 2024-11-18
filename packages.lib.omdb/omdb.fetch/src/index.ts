import type { Omdb } from '@get-subtext/lib.omdb';
import type { FetchOmdbOptions } from './index.types';
import { FetchOmdb } from './services/FetchOmdb';
import { FetchOmdbInternal } from './services/FetchOmdbInternal';

export type * from './index.types';

export class FetchOmdbFactory {
  private constructor() {}

  public static create({ config, fetch }: FetchOmdbOptions): Omdb {
    const fetchOmdbInternal = new FetchOmdbInternal(config.apiKey, config.apiUrlBase, fetch);
    return new FetchOmdb(fetchOmdbInternal);
  }
}
