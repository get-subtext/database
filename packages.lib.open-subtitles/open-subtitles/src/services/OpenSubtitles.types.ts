export interface File {
  id: number;
  name: string;
}

export interface Poster {
  posterId: string;
  origin: string;
  url: string;
}

export interface Movie {
  title: string | null;
  releaseYear: number | null;
  posters: Poster[];
  author: string | null;
  files: File[];
}

export interface MoviePage {
  totalPages: number;
  movies: Movie[];
}

export interface OpenSubtitles {
  getMovies: (imdbId: string, pageNumber: number) => Promise<MoviePage>;
  getSrtUrl: (fileId: number) => Promise<string | null>;
  downloadSrtFile: (url: string) => Promise<string>;
}
