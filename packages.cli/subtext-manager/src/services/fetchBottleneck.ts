import Bottleneck from 'bottleneck';

export type Fetch = (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;

export const fetchBottleneck =
  (fetch: Fetch, bottleneck: Bottleneck): Fetch =>
  async (input, init?): Promise<Response> => {
    return await bottleneck.schedule(() => fetch(input, init));
  };
