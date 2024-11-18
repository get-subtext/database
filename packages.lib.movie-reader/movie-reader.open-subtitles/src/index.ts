import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { OpenSubtitlesMovieReaderOptions } from './index.types';
import { OpenSubtitlesMovieReader } from './services/OpenSubtitlesMovieReader';

export type * from './index.types';
export type * from './services/OpenSubtitlesMovieReader.types';

export class OpenSubtitlesMovieReaderFactory {
  private constructor() {}

  public static create({ openSubtitles, tap }: OpenSubtitlesMovieReaderOptions): MovieReader {
    return new OpenSubtitlesMovieReader(openSubtitles, tap);
  }
}
