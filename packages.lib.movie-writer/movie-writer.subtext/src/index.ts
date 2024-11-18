import type { MovieWriter } from '@get-subtext/lib.movie-writer';
import type { SubTextMovieWriterOptions } from './index.types';
import { SubTextMovieWriter } from './services/SubTextMovieWriter';

export type * from './index.types';
export type * from './services/SubTextMovieWriter.types';

export class SubTextMovieWriterFactory {
  private constructor() {}

  public static create({ subText: SubText, tap }: SubTextMovieWriterOptions): MovieWriter {
    return new SubTextMovieWriter(SubText, tap);
  }
}
