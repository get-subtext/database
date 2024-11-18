export interface FetchOpenSubtitlesConfig {
  apiKey: string;
  apiUrlBase: string;
}

export interface FetchOpenSubtitlesOptions {
  config: FetchOpenSubtitlesConfig;
  fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
}
