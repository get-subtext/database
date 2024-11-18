import type * as T from '@get-subtext/lib.movie-reader';
import { reduceMovies } from '@get-subtext/lib.movie-reader';
import { map } from 'lodash-es';
import type { MovieReaderTap } from './CompositeMovieReader.types';

export class CompositeMovieReader implements T.MovieReader {
  public constructor(
    private readonly movieReaders: T.MovieReader[],
    private readonly tap?: MovieReaderTap
  ) {}

  public async read(request: T.MovieRequest): Promise<T.MovieResponse> {
    try {
      const errors: Error[] = [];
      this.tap?.readStarted(request);

      const readPromises = map(this.movieReaders, (r) => r.read(request));
      const readResults = await Promise.allSettled(readPromises);

      const movies: T.Movie[] = [];
      for (let i = 0; i < readResults.length; i++) {
        const readRes = readResults[i];
        if (readRes.status === 'fulfilled') {
          if (readRes.value === null) continue;
          if (readRes.value.movie !== null) movies.push(readRes.value.movie);
          errors.push(...readRes.value.errors);
        } else {
          errors.push(readRes.reason);
        }
      }

      const movie = reduceMovies(movies);
      this.tap?.readFinished(request, movie, errors);
      return { movie, errors };
    } catch (cause) {
      const error = new Error(`[${CompositeMovieReader.name}] ${this.read.name} failed: unexpected error`, { cause });
      this.tap?.readFinished(request, null, [error]);
      throw error;
    }
  }
}
