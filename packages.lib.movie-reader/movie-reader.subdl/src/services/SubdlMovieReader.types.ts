import type * as T from '@get-subtext/lib.movie-reader';

export interface SubdlSanitisedSubtitleFile {
  url: string;
  author: string | null;
  subtitleFiles: Record<string, string[]>;
}

export interface MovieReaderTap {
  readStarted: (request: T.MovieRequest) => void;
  readFinished: (request: T.MovieRequest, movie: T.Movie | null, errors: Error[]) => void;
}
