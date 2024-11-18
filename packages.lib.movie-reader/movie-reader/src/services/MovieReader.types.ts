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

export interface MovieRequest {
  userId: string;
  imdbId: string;
}

export interface MovieResponse {
  movie: Movie | null;
  errors: Error[];
}

export interface MovieReader {
  read: (movieRequest: MovieRequest) => Promise<MovieResponse>;
}
