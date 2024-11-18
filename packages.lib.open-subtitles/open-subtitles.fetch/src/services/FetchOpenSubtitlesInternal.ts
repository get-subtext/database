import * as S from '../schemas/OpenSubtitlesSchemas';
import type * as T from './FetchOpenSubtitlesInternal.types';

export class FetchOpenSubtitlesInternal implements T.FetchOpenSubtitlesInternal {
  public constructor(
    private readonly apiKey: string,
    private readonly apiUrlBase: string,
    private readonly fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>
  ) {}

  public async getSubtitles(imdbId: string, page: number): Promise<T.Subtitles> {
    const url = `${this.apiUrlBase}/subtitles?imdb_id=${imdbId}&page=${page}`;
    const headers = this.createHeaders(this.apiKey);
    const response = await this.fetch(url, { headers });

    // Unfortunately, this API returns the same response for both a request with an invalid ApiKey _and_ a request
    // with an invalid IMDb ID, making it impossible to determine if the movie was found:
    // { "message": "You cannot consume this service" } 403 Forbidden
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchOpenSubtitlesInternal.name}] ${this.getSubtitles.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    const parsed = S.SubtitlesSchema.safeParse(await response.json());
    if (!parsed.success)
      throw new Error(`[${FetchOpenSubtitlesInternal.name}] ${this.getSubtitles.name} failed: could not parse response`, { cause: parsed.error });

    return parsed.data;
  }

  public async getDownloadMeta(fileId: number): Promise<T.DownloadMeta> {
    const body = { file_id: fileId, sub_format: 'srt' };

    const url = `${this.apiUrlBase}/download`;
    const method = 'POST';
    const headers = this.createHeaders(this.apiKey);
    const response = await this.fetch(url, { method, headers, body: JSON.stringify(body) });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchOpenSubtitlesInternal.name}] ${this.getDownloadMeta.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    const parsed = S.DownloadMetaSchema.safeParse(await response.json());
    if (!parsed.success)
      throw new Error(`[${FetchOpenSubtitlesInternal.name}] ${this.getSubtitles.name} failed: could not parse response`, { cause: parsed.error });

    return parsed.data;
  }

  public async downloadFile(url: string): Promise<string> {
    const response = await this.fetch(url);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`[${FetchOpenSubtitlesInternal.name}] ${this.downloadFile.name} failed: fetch response ${response.status} - ${errorDetails}`);
    }

    return await response.text();
  }

  private createHeaders(apiKey: string) {
    return { Accept: 'application/json', 'Api-Key': apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };
  }
}
