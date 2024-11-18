import type { FetchTapOptions } from './index.types';

export { sanitiseInput } from './utils/sanitiseInput';

export const createFetchTap =
  ({ fetch, tap }: FetchTapOptions) =>
  async (input: string | URL | globalThis.Request, init?: RequestInit) => {
    try {
      await tap(input, init);
    } catch (err) {
      console.error(err);
    }

    return await fetch(input, init);
  };
