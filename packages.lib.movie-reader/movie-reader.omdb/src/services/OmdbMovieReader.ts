import type * as T from '@get-subtext/lib.movie-reader';
import type { Movie, Omdb } from '@get-subtext/lib.omdb';
import { isNil } from 'lodash-es';
import type { MovieReaderTap } from './OmdbMovieReader.types';

export class OmdbMovieReader implements T.MovieReader {
  public constructor(
    private readonly api: Omdb,
    private readonly tap?: MovieReaderTap
  ) {}

  public async read(request: T.MovieRequest): Promise<T.MovieResponse> {
    try {
      this.tap?.readStarted(request);
      const omdbMovie = await this.api.getMovie(request.imdbId);
      const movie = isNil(omdbMovie) ? null : this.toMovie(omdbMovie);
      this.tap?.readFinished(request, movie, []);
      return { movie, errors: [] };
    } catch (cause) {
      const error = new Error(`[${OmdbMovieReader.name}] ${this.read.name} failed: unexpected error`, { cause });
      this.tap?.readFinished(request, null, [error]);
      throw error;
    }
  }

  public toMovie(omdbMovie: Movie): T.Movie {
    return {
      imdbId: omdbMovie.imdbId,
      title: omdbMovie.title,
      posters: omdbMovie.posters,
      releaseDate: omdbMovie.releaseDate,
      releaseYear: omdbMovie.releaseYear,
      rated: omdbMovie.rated,
      genres: omdbMovie.genres,
      directors: omdbMovie.directors,
      writers: omdbMovie.writers,
      actors: omdbMovie.actors,
      runTimeMins: omdbMovie.runTimeMins,
      plot: omdbMovie.plot,
      subtitleFiles: [],
    };
  }
}
