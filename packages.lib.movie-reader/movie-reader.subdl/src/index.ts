import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { SubdlMovieReaderOptions } from './index.types';
import { SubdlMovieReader } from './services/SubdlMovieReader';

export type * from './index.types';
export type * from './services/SubdlMovieReader.types';

export class SubdlMovieReaderFactory {
  private constructor() {}

  public static create({ config, subdl, tap }: SubdlMovieReaderOptions): MovieReader {
    return new SubdlMovieReader(config.zipUrlBase, subdl, tap);
  }
}
