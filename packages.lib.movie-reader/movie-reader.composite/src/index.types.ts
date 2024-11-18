import type { MovieReader } from '@get-subtext/lib.movie-reader';
import type { MovieReaderTap } from './services/CompositeMovieReader.types';

export interface CompositeMovieReaderOptions {
  movieReaders: MovieReader[];
  tap?: MovieReaderTap;
}
