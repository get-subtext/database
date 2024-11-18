import type { Movie } from '@get-subtext/lib.movie-writer';

export interface SubTextMovieWriterTap {
  writeStarted: (movie: Movie) => void;
  movieIndexSaved: (imdbId: string, filePath: string) => void;
  posterIndexSaved: (imdbId: string, filePath: string) => void;
  posterImageSaved: (imdbId: string, filePath: string) => void;
  subtitleFileIndexSaved: (imdbId: string, filePath: string) => void;
  writeFinished: (movie: Movie, filePaths: string[]) => void;
}
