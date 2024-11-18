import { emptyImdbId } from '../constants/emptyImdbId';
import { emptyTitle } from '../constants/emptyTitle';
import type { Movie } from '../services/MovieReader.types';

export const emptyMovie = (): Movie => ({
  imdbId: emptyImdbId,
  title: emptyTitle,
  posters: [],
  releaseDate: null,
  releaseYear: null,
  rated: null,
  genres: [],
  directors: [],
  writers: [],
  actors: [],
  runTimeMins: null,
  plot: null,
  subtitleFiles: [],
});
