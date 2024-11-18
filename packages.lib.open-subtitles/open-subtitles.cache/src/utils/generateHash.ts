import { createHash } from 'crypto';

export const generateHash = (text: string): string => {
  return createHash('md5').update(text).digest('hex');
};
