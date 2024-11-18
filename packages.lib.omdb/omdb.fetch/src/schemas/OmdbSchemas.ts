import { z } from 'zod';

// Note: Commenting out unused fields/objects for now.
// This prevents parsing issues if the data isn't required yet.
// If a field becomes necessary, simply uncomment it.

// export const OmdbRatingSchema = z.object({
//   Source: z.string().optional().nullable(),
//   Value: z.string().optional().nullable(),
// });

export const OmdbMovieSchema = z.object({
  Title: z.string().optional().nullable(),
  Year: z.string().optional().nullable(),
  Rated: z.string().optional().nullable(),
  Released: z.string().optional().nullable(),
  Runtime: z.string().optional().nullable(),
  Genre: z.string().optional().nullable(),
  Director: z.string().optional().nullable(),
  Writer: z.string().optional().nullable(),
  Actors: z.string().optional().nullable(),
  Plot: z.string().optional().nullable(),
  // Language: z.string().optional().nullable(),
  // Country: z.string().optional().nullable(),
  // Awards: z.string().optional().nullable(),
  Poster: z.string().optional().nullable(),
  // Ratings: z.array(OmdbRatingSchema),
  // Metascore: z.string().optional().nullable(),
  // imdbRating: z.string().optional().nullable(),
  // imdbVotes: z.string().optional().nullable(),
  // imdbID: z.string().optional().nullable(),
  // Type: z.string().optional().nullable(),
  // DVD: z.string().optional().nullable(),
  // BoxOffice: z.string().optional().nullable(),
  // Production: z.string().optional().nullable(),
  // Website: z.string().optional().nullable(),
  Response: z.string().optional().nullable(),
  Error: z.string().optional().nullable(),
});
