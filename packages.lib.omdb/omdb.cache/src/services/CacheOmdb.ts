import type * as T from '@get-subtext/lib.omdb';
import type { Cache } from '@studio-75/lib.cache';
import { generateHash } from '../utils/generateHash';

export class CacheOmdb implements T.Omdb {
  public constructor(
    private readonly ttl: number,
    private readonly instance: T.Omdb,
    private readonly cache: Cache
  ) {}

  public async getMovie(imdbId: string): Promise<T.Movie | null> {
    const key = generateHash(`omdb.movie.${imdbId}`);
    const maybeMovie = await this.cache.get<T.Movie>(key);
    if (maybeMovie !== null) return maybeMovie;

    const movie = await this.instance.getMovie(imdbId);
    if (movie !== null) await this.cache.set<T.Movie>(key, movie, this.ttl);
    return movie;
  }
}
