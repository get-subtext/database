import type { SubText } from '@get-subtext/lib.subtext';
import { map, orderBy } from 'lodash-es';
import type * as T from './Database.types';

export class Database implements T.Database {
  public constructor(
    private readonly api: SubText,
    private readonly tap?: T.DatabaseTap
  ) {}

  public async indexQueries(userId: string) {
    this.tap?.indexQueriesStarted();

    const movieIds = await this.api.getAllMovieIds();
    const moviesRaw: T.MovieIndexRaw[] = [];
    for (let i = 0; i < movieIds.length; i++) {
      const movieId = movieIds[i];
      const movie = await this.api.getMovieData(movieId);
      if (movie !== null) {
        moviesRaw.push({
          imdbId: movie.imdbId,
          title: movie.title,
          releaseDate: movie.releaseDate,
          releaseYear: movie.releaseYear,
        });
      }
    }

    const moviesSorted = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
    const imdbIds = map(moviesSorted, (m) => m.imdbId);
    const pageSize = 100;
    const pageCount = Math.ceil(moviesSorted.length / pageSize);

    const timestamp = new Date().toISOString();
    await this.api.deleteAllQueries();
    for (let i = 0; i < pageCount; i++) {
      const start = i * pageSize;
      const end = start + pageSize;
      const pageIds = imdbIds.slice(start, end);
      const queryIndex: T.QueryIndex = { pageNumber: i + 1, pageSize, pageCount, imdbIds: pageIds };

      const indexFilePath = await this.api.writeQueryIndex(queryIndex, userId, timestamp);
    }

    try {
      this.tap?.indexQueriesFinished();
    } catch (cause) {
      throw new Error(`[${Database.name}] ${this.indexQueries.name} failed`, { cause });
    }
  }
}
