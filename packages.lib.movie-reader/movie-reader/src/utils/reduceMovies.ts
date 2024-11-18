import { concat, isEqual, isNil, uniq } from 'lodash-es';
import { emptyImdbId } from '../constants/emptyImdbId';
import { emptyTitle } from '../constants/emptyTitle';
import type { Movie } from '../services/MovieReader.types';
import { compactPosters } from './compactPosters';
import { compactSubtitleFiles } from './compactSubtitleFiles';
import { emptyMovie } from './emptyMovie';

export const reduceMovies = (movies: (Movie | null)[]): Movie | null => {
  const movie = movies.reduce<Movie>((accumulator, maybeMovie) => {
    const movie = isNil(maybeMovie) ? emptyMovie() : maybeMovie;
    return {
      imdbId: isNil(accumulator.imdbId) || accumulator.imdbId === emptyImdbId ? movie.imdbId : accumulator.imdbId,
      title: isNil(accumulator.title) || accumulator.title === emptyTitle ? movie.title : accumulator.title,
      posters: concat(accumulator.posters, movie.posters),
      releaseDate: accumulator.releaseDate ?? movie.releaseDate,
      releaseYear: accumulator.releaseYear ?? movie.releaseYear,
      rated: accumulator.rated ?? movie.rated,
      genres: uniq(concat(accumulator.genres, movie.genres)),
      directors: uniq(concat(accumulator.directors, movie.directors)),
      writers: uniq(concat(accumulator.writers, movie.writers)),
      actors: uniq(concat(accumulator.actors, movie.actors)),
      runTimeMins: accumulator.runTimeMins ?? movie.runTimeMins,
      plot: accumulator.plot ?? movie.plot,
      subtitleFiles: concat(accumulator.subtitleFiles, movie.subtitleFiles),
    };
  }, emptyMovie());

  movie.subtitleFiles = compactSubtitleFiles(movie.subtitleFiles);
  movie.posters = compactPosters(movie.posters);

  return isEqual(movie, emptyMovie()) ? null : movie;
};
