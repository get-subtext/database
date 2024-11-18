import type { Omdb } from '@get-subtext/lib.omdb';
import type { MovieReaderTap } from './services/OmdbMovieReader.types';

export interface OmdbMovieReaderOptions {
  omdb: Omdb;
  tap?: MovieReaderTap;
}
