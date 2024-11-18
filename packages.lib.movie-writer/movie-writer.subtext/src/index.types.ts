import type { SubText } from '@get-subtext/lib.subtext';
import type { SubTextMovieWriterTap } from './services/SubTextMovieWriter.types';

export interface SubTextMovieWriterOptions {
  subText: SubText;
  tap?: SubTextMovieWriterTap;
}
