import { z } from 'zod';

// Note: Commenting out unused fields/objects for now.
// This prevents parsing issues if the data isn't required yet.
// If a field becomes necessary, simply uncomment it.

export const ResultSchema = z.object({
  // sd_id: z.number().optional().nullable(),
  // type: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  // imdb_id: z.string().optional().nullable(),
  // tmdb_id: z.number().optional().nullable(),
  // first_air_date: z.string().optional().nullable(),
  release_date: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
});

export const SubtitleSchema = z.object({
  // release_name: z.string().optional().nullable(),
  // name: z.string().optional().nullable(),
  // lang: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  // subtitlePage: z.string().optional().nullable(),
  // season: z.number().nullable().optional(),
  // episode: z.number().nullable().optional(),
  // language: z.string().optional().nullable(),
  // hi: z.boolean().optional().nullable(),
  // episode_from: z.number().nullable().optional(),
  // episode_end: z.number().optional().nullable(),
  // full_season: z.boolean().optional().nullable(),
});

export const MovieSchema = z.object({
  status: z.boolean().optional().nullable(),
  error: z.string().optional().nullable(),
  results: z.array(ResultSchema).optional(),
  subtitles: z.array(SubtitleSchema).optional(),
});
