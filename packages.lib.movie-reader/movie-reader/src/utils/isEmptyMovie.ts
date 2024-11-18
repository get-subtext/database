import { isEqual, isNil } from 'lodash-es';
import type { Movie } from '../services/MovieReader.types';
import { emptyMovie } from './emptyMovie';

export const isEmptyMovie = (movie: Movie | null | undefined): boolean => isNil(movie) || isEqual(movie, emptyMovie());
