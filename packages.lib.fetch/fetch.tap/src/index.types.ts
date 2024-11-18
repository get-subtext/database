export interface FetchTapOptions {
  fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
  tap: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<void>;
}
