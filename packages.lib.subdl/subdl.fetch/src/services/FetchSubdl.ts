import { emptyTitle } from '@get-subtext/lib.movie-reader';
import type * as T from '@get-subtext/lib.subdl';
import { isNil, map } from 'lodash-es';
import type { FetchSubdlInternal, Movie } from './FetchSubdlInternal.types';

export class FetchSubdl implements T.Subdl {
  public constructor(private readonly fetchSubdlInternal: FetchSubdlInternal) {}

  public async getMovie(imdbId: string): Promise<T.Movie | null> {
    const movie = await this.fetchSubdlInternal.getMovie(imdbId);

    if (movie.status === false) {
      // This is the API's response when an invalid IMDb ID is provided or no result is found.
      if (movie.error === "can't find movie or tv") return null;
      throw new Error(`[${FetchSubdl.name}] ${this.getMovie.name} failed: ${movie.error}`);
    }

    const meta = this.getMeta(movie);
    return {
      title: meta.title ?? emptyTitle,
      releaseDate: meta.releaseDate,
      releaseYear: meta.releaseYear,
      subtitles: map(movie.subtitles, (s) => ({ baseUrl: s.url ?? '<Unknown URL>', author: s.author ?? null })),
    };
  }

  public async downloadFile(urlPath: string): Promise<ArrayBuffer> {
    return await this.fetchSubdlInternal.downloadFile(urlPath);
  }

  private getMeta(movie: Movie) {
    const meta: T.Meta = { title: null, releaseDate: null, releaseYear: null };

    // Assuming results is an array for TV episodes?
    // Let's iterate and get the data, with first element taking priority.
    if (!isNil(movie.results)) {
      for (let i = 0; i < movie.results.length; i++) {
        const result = movie.results[i];
        meta.title = meta.title ?? result.name ?? null;
        meta.releaseDate = meta.releaseDate ?? result.release_date ?? null;
        meta.releaseYear = meta.releaseYear ?? result.year ?? null;
      }
    }

    return meta;
  }
}
