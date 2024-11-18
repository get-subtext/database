import { sanitiseInput } from '@get-subtext/lib.fetch.tap';
import type { Logger } from '@studio-75/lib.logging';
import { cyan, gray, yellow } from 'colorette';
import { isString } from 'lodash-es';

export const fetchTap =
  (logger: Logger, verbose = false) =>
  async (input: string | URL | globalThis.Request, init?: RequestInit) => {
    try {
      const info = sanitiseInput(input, init);
      info.body = isString(info.body) ? info.body.substring(100) : '<ignored>';
      if (verbose) {
        logger.trace(`${gray('[fetch]')} invoked`, info);
      } else {
        logger.trace(`${gray('[fetch]')} ${cyan(info.method)} invoked: ${yellow(info.url)}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
