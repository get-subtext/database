export interface FetchSubdlConfig {
  apiKey: string;
  apiUrlBase: string;
  zipUrlBase: string;
}

export interface FetchSubdlOptions {
  config: FetchSubdlConfig;
  fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
}
