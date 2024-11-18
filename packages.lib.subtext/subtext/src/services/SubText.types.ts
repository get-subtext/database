export interface GetMovieDataResponse {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  posterFileName: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleIds: string[];
  isAvailable: boolean;
}

export interface StMovieIndex {
  imdbId: string;
  title: string;
  posterIds: string[];
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitleFileIds: string[];
  isAvailable: boolean;
}

export interface StPosterSource {
  origin: string;
  url: string;
}

export interface StPosterIndex {
  imdbId: string;
  posterId: string;
  source: StPosterSource;
  fileName: string;
}

export interface StPosterImage {
  imdbId: string;
  posterId: string;
  url: string;
  fileName: string;
}

export enum StSourceTypeEnum {
  ZipFile = 'ZipFile',
  StandaloneFile = 'StandaloneFile',
}

export interface StZipFileSource {
  origin: string;
  type: StSourceTypeEnum.ZipFile;
  author: string | null;
  url: string;
  zipFileName: string;
  textFileName: string;
}

export interface StStandaloneFileSource {
  origin: string;
  type: StSourceTypeEnum.StandaloneFile;
  author: string | null;
  url: string;
  textFileName: string;
}

export interface StSubtitleFileIndex {
  imdbId: string;
  subtitleFileId: string;
  source: StZipFileSource | StStandaloneFileSource;
  subtitles: string[];
}

export interface WriteIndexDataInputMovie {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  imdbIds: string[];
}

export enum RequestResultEnum {
  NotFound = 'NotFound',
  FoundNoSubtitles = 'FoundNoSubtitles',
  FoundWithSubtitles = 'FoundWithSubtitles',
}

export interface Request {
  requestId: string;
  userId: string;
  imdbId: string;
  result: RequestResultEnum;
}

export interface SubText {
  getAllMovieIds: () => Promise<string[]>;
  getMovieData: (imdbId: string) => Promise<GetMovieDataResponse>;
  writeRequestIndex: (request: Request) => Promise<string>;
  writeMovieIndex: (movie: StMovieIndex) => Promise<string>;
  writePosterIndex: (post: StPosterIndex) => Promise<string>;
  writePosterImage: (post: StPosterImage) => Promise<string>;
  writeSubtitleFileIndex: (subtitleFile: StSubtitleFileIndex) => Promise<string>;
  writeQueryIndex: (data: WriteIndexDataInputMovie, userId: string, timestamp: string) => Promise<string>;
  deleteAllQueries: () => Promise<void>;
}
