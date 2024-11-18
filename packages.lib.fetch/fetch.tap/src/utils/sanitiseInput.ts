export interface FetchInput {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | any;
}

export const sanitiseInput = (input: string | URL | globalThis.Request, init?: RequestInit) => {
  const sanitised: FetchInput = {
    url: <string>input,
    method: init?.method ?? 'GET',
    headers: <any>init?.headers ?? {},
    body: init?.body ?? null,
  };

  return sanitised;
};
