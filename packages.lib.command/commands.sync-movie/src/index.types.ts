import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { MovieWriter } from '@get-subtext/lib.movie-writer';
import type { SyncMovieCommandTap } from './services/SyncMovieCommand.types';

export interface SyncMovieCommandOptions {
  movieReader: MovieReader;
  movieWriter: MovieWriter;
  tap?: SyncMovieCommandTap;
}
