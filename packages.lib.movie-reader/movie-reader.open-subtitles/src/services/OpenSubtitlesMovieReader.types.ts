import type * as T from '@get-subtext/lib.movie-reader';

export interface OsSanitisedFile {
  id: number;
  author: string | null;
  name: string;
}

export interface MovieReaderTap {
  readStarted: (request: T.MovieRequest) => void;
  readFinished: (request: T.MovieRequest, movie: T.Movie | null, errors: Error[]) => void;
}
