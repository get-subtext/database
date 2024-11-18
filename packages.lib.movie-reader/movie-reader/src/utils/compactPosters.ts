import { includes } from 'lodash-es';
import type { Poster } from '../services/MovieReader.types';

export const compactPosters = (posters: Poster[]): Poster[] => {
  const output: Poster[] = [];
  const posterIds: string[] = [];
  for (let i = 0; i < posters.length; i++) {
    const poster = posters[i];
    if (!includes(posterIds, poster.posterId)) {
      output.push(poster);
      posterIds.push(poster.posterId);
    }
  }

  return output;
};
