import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { OmdbMovieReaderOptions } from './index.types';
import { OmdbMovieReader } from './services/OmdbMovieReader';

export type * from './index.types';
export type * from './services/OmdbMovieReader.types';

export class OmdbMovieReaderFactory {
  private constructor() {}

  public static create({ omdb, tap }: OmdbMovieReaderOptions): MovieReader {
    return new OmdbMovieReader(omdb, tap);
  }
}
