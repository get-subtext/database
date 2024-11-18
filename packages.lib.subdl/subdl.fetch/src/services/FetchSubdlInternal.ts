import * as S from '../schemas/SubdlSchemas';
import type * as T from './FetchSubdlInternal.types';

export class FetchSubdlInternal implements T.FetchSubdlInternal {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly zipUrlBase: string,
    private readonly fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>
  ) {}

  public async getMovie(imdbId: string): Promise<T.Movie> {
    const url = `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=${this.apiKey}`;
    const response = await this.fetch(url);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchSubdlInternal.name}] ${this.getMovie.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    const parsed = S.MovieSchema.safeParse(await response.json());
    if (!parsed.success) throw new Error(`[${FetchSubdlInternal.name}] ${this.getMovie.name} failed: could not parse response`, { cause: parsed.error });

    return parsed.data;
  }

  public async downloadFile(urlPath: string): Promise<ArrayBuffer> {
    const url = `${this.zipUrlBase}${urlPath}`;
    const response = await this.fetch(url);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchSubdlInternal.name}] ${this.downloadFile.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    return (await response.arrayBuffer()) as ArrayBuffer;
  }
}
