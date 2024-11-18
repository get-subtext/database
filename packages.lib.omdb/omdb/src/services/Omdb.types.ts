export interface Poster {
  posterId: string;
  origin: string;
  url: string;
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
}

export interface Omdb {
  getMovie(imdbId: string): Promise<Movie | null>;
}
