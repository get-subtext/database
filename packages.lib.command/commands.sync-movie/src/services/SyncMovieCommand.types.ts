export enum SourceTypeEnum {
  ZipFile = 'ZipFile',
  StandaloneFile = 'StandaloneFile',
}

export interface Poster {
  posterId: string;
  origin: string;
  url: string;
}

export interface SubtitleFile {
  subtitleFileId: string;
  source: ZipFileSource | StandaloneFileSource;
  subtitles: string[];
}

export interface ZipFileSource {
  origin: string;
  type: SourceTypeEnum.ZipFile;
  author: string | null;
  url: string;
  zipFileName: string;
  textFileName: string;
}

export interface StandaloneFileSource {
  origin: string;
  type: SourceTypeEnum.StandaloneFile;
  author: string | null;
  url: string;
  textFileName: string;
}

export interface Movie {
  imdbId: string;
  title: string;
  posters: Poster[];
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitleFiles: SubtitleFile[];
}

export interface SyncMovieCommandRequest {
  requestId: string;
  userId: string;
  imdbId: string;
}

export interface SyncMovieCommand {
  run: (request: SyncMovieCommandRequest) => Promise<Movie | null>;
}

export interface SyncMovieCommandTap {
  runStarted: (request: SyncMovieCommandRequest) => void;
  runFinished: (request: SyncMovieCommandRequest, movie: Movie | null, errors: Error[]) => void;
}
