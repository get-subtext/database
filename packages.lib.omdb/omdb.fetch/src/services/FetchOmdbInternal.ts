import * as S from '../schemas/OmdbSchemas';
import type * as T from './FetchOmdbInternal.types';

export class FetchOmdbInternal implements T.FetchOmdbInternal {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>
  ) {}

  public async getMovie(imdbId: string): Promise<T.OmdbMovie> {
    const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
    const response = await this.fetch(url);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchOmdbInternal.name}] ${this.getMovie.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    const parsed = S.OmdbMovieSchema.safeParse(await response.json());
    if (!parsed.success) throw new Error(`[${FetchOmdbInternal.name}] ${this.getMovie.name} failed: could not parse response`, { cause: parsed.error });

    return parsed.data;
  }
}
