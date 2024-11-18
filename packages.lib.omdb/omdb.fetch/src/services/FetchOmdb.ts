import { generateHash, sanitiseTitle } from '@get-subtext/lib.movie-reader';
import type * as T from '@get-subtext/lib.omdb';
import { endsWith, isNil, map, parseInt, split, trim } from 'lodash-es';
import type { FetchOmdbInternal } from './FetchOmdbInternal.types';

const origin = 'OMDB';

// Note, the API seems to return "N/A" in a lot of places, so guarding against this
export class FetchOmdb implements T.Omdb {
  public constructor(private readonly fetchOmdbInternal: FetchOmdbInternal) {}

  public async getMovie(imdbId: string): Promise<T.Movie | null> {
    const movie = await this.fetchOmdbInternal.getMovie(imdbId);

    if (movie.Response === 'False') {
      // This is the API's response when an invalid IMDb ID is provided or no result is found.
      if (movie.Error === 'Incorrect IMDb ID.' || movie.Error === 'Error getting data.') return null;
      throw new Error(`[${FetchOmdb.name}] ${this.getMovie.name} failed: ${movie.Error}`);
    }

    return {
      imdbId,
      title: sanitiseTitle(movie.Title),
      posters: this.parsePoster(movie.Poster),
      releaseDate: this.parseReleaseDate(movie.Released),
      releaseYear: this.parseReleaseYear(movie.Year),
      rated: this.parseText(movie.Rated),
      genres: this.parseTextArray(movie.Genre),
      directors: this.parseTextArray(movie.Director),
      writers: this.parseTextArray(movie.Writer),
      actors: this.parseTextArray(movie.Actors),
      runTimeMins: this.parseRunTime(movie.Runtime),
      plot: this.parseText(movie.Plot),
    };
  }

  private parsePoster(text: string | null | undefined) {
    return this.isNilOrNotApplicable(text) ? [] : [{ posterId: generateHash(text), url: text, origin }];
  }

  private parseText(text: string | null | undefined) {
    return this.isNilOrNotApplicable(text) ? null : text;
  }

  private parseTextArray(text: string | null | undefined) {
    return this.isNilOrNotApplicable(text) ? [] : map(split(text, ','), (g) => trim(g));
  }

  private parseReleaseDate(date: string | null | undefined) {
    if (this.isNilOrNotApplicable(date)) return null;
    try {
      return new Date(Date.parse(`${date} UTC`)).toISOString();
    } catch {
      return null;
    }
  }

  private parseReleaseYear(year: string | null | undefined) {
    if (this.isNilOrNotApplicable(year)) return null;
    try {
      return parseInt(year, 10);
    } catch {
      return null;
    }
  }

  private parseRunTime(runTime: string | null | undefined) {
    if (this.isNilOrNotApplicable(runTime)) return null;
    try {
      if (!endsWith(runTime, 'min')) return null;
      return parseInt(runTime, 10);
    } catch {
      return null;
    }
  }

  private isNilOrNotApplicable(text: string | null | undefined) {
    return isNil(text) || text === '' || text === 'N/A';
  }
}
