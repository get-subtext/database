import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { CompositeMovieReaderOptions } from './index.types';
import { CompositeMovieReader } from './services/CompositeMovieReader';

export type * from './index.types';
export type * from './services/CompositeMovieReader.types';

export class CompositeMovieReaderFactory {
  private constructor() {}

  public static create({ movieReaders, tap }: CompositeMovieReaderOptions): MovieReader {
    return new CompositeMovieReader(movieReaders, tap);
  }
}
