import type * as T from '@get-subtext/lib.subdl';
import type { Cache } from '@studio-75/lib.cache';
import { generateHash } from '../utils/generateHash';

export class CacheSubdl implements T.Subdl {
  public constructor(
    private readonly ttl: number,
    private readonly instance: T.Subdl,
    private readonly cache: Cache
  ) {}

  public async getMovie(imdbId: string): Promise<T.Movie | null> {
    const key = generateHash(`subdl.movie.${imdbId}`);
    const maybeMovie = await this.cache.get<T.Movie>(key);
    if (maybeMovie !== null) return maybeMovie;

    const movie = await this.instance.getMovie(imdbId);
    if (movie !== null) await this.cache.set<T.Movie>(key, movie, this.ttl);
    return movie;
  }

  public async downloadFile(url: string): Promise<ArrayBuffer> {
    return await this.instance.downloadFile(url);
  }
}
