import type { Subdl } from '@get-subtext/lib.subdl';
import type { FetchSubdlOptions } from './index.types';
import { FetchSubdl } from './services/FetchSubdl';
import { FetchSubdlInternal } from './services/FetchSubdlInternal';

export type * from './index.types';

export class FetchSubdlFactory {
  private constructor() {}

  public static create({ config, fetch }: FetchSubdlOptions): Subdl {
    const fetchSubdlInternal = new FetchSubdlInternal(config.apiKey, config.apiUrlBase, config.zipUrlBase, fetch);
    return new FetchSubdl(fetchSubdlInternal);
  }
}
