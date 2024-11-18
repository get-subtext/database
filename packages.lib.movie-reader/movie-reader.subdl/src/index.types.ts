import type { Subdl } from '@get-subtext/lib.subdl';
import type { MovieReaderTap } from './services/SubdlMovieReader.types';

export interface SubdlMovieReaderConfig {
  zipUrlBase: string;
}

export interface SubdlMovieReaderOptions {
  config: SubdlMovieReaderConfig;
  subdl: Subdl;
  tap?: MovieReaderTap;
}
