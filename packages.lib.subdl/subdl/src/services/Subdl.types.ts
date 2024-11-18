export interface Subtitle {
  baseUrl: string;
  author: string | null;
}

export interface Movie {
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  subtitles: Subtitle[];
}

export interface Meta {
  title: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
}

export interface Subdl {
  getMovie: (imdbId: string) => Promise<Movie | null>;
  downloadFile: (url: string) => Promise<ArrayBuffer>;
}
