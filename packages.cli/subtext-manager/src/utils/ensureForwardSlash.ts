import { replace } from 'lodash-es';

export const ensureForwardSlash = (text: string) => replace(text, /\\/g, '/');
