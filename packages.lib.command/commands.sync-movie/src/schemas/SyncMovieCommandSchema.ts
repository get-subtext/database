import { z } from 'zod';

export const SyncMovieCommandRequestSchema = z.object({
  requestId: z.string(),
  userId: z.string(),
  imdbId: z.string().regex(/^tt\d{7,8}$/, { message: 'Invalid IMDb ID format' }),
});
