import { z } from 'zod';
import * as S from '../schemas/OmdbSchemas';

// Note: Commenting out unused fields/objects for now.
// This prevents parsing issues if the data isn't required yet.
// If a field becomes necessary, simply uncomment it.

// export type OmdbRating = z.infer<typeof S.OmdbRatingSchema>;
export type OmdbMovie = z.infer<typeof S.OmdbMovieSchema>;

export interface FetchOmdbInternal {
  getMovie: (imdbId: string) => Promise<OmdbMovie>;
}
