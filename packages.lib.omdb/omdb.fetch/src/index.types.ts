export interface FetchOmdbConfig {
  apiKey: string;
  apiUrlBase: string;
}

export interface FetchOmdbOptions {
  config: FetchOmdbConfig;
  fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
}
