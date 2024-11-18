import type * as T from '@get-subtext/lib.open-subtitles';
import type { Cache } from '@studio-75/lib.cache';
import path from 'path';
import { generateHash } from '../utils/generateHash';

export class CacheOpenSubtitles implements T.OpenSubtitles {
  public constructor(
    private readonly ttl: number,
    private readonly instance: T.OpenSubtitles,
    private readonly cache: Cache
  ) {}

  public async getMovies(imdbId: string, pageNumber: number): Promise<T.MoviePage> {
    const key = generateHash(`openSubtitles.movies.${imdbId}.${pageNumber}`);
    const maybeMovie = await this.cache.get<T.MoviePage>(key);
    if (maybeMovie !== null) return maybeMovie;

    const movies = await this.instance.getMovies(imdbId, pageNumber);
    if (movies !== null) await this.cache.set<T.MoviePage>(key, movies, this.ttl);
    return movies;
  }

  public async getSrtUrl(fileId: number): Promise<string | null> {
    const key = generateHash(`openSubtitles.srtUrl.${fileId}`);
    const maybeSrtUrl = await this.cache.get<string>(key);
    if (maybeSrtUrl !== null) return maybeSrtUrl;

    const srtUrl = await this.instance.getSrtUrl(fileId);
    if (srtUrl !== null) await this.cache.set<string>(key, srtUrl, this.ttl);
    return srtUrl;
  }

  public async downloadSrtFile(url: string): Promise<string> {
    const key = generateHash(`openSubtitles.srtFile.${path.basename(url)}`);
    const maybeSrtFile = await this.cache.get<string>(key);
    if (maybeSrtFile !== null) return maybeSrtFile;

    // From https://opensubtitles.stoplight.io/docs/opensubtitles-api/6be7f6ae2d918-download
    // The download URL is temporary, and cannot be used more than 3 hours, so do not cache it,
    // but you can download the file more than once if needed.
    const ttl = 1000 * 60 * 60 * 2.5;
    const srtFile = await this.instance.downloadSrtFile(url);
    if (srtFile !== null) await this.cache.set<string>(key, srtFile, ttl);
    return srtFile;
  }
}
