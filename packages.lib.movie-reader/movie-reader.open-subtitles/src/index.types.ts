import type { OpenSubtitles } from '@get-subtext/lib.open-subtitles';
import type { MovieReaderTap } from './services/OpenSubtitlesMovieReader.types';

export interface OpenSubtitlesMovieReaderOptions {
  openSubtitles: OpenSubtitles;
  tap?: MovieReaderTap;
}
