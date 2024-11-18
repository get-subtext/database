import { z } from 'zod';

// Note: Commenting out unused fields/objects for now.
// This prevents parsing issues if the data isn't required yet.
// If a field becomes necessary, simply uncomment it.

export const FileSchema = z.object({
  file_id: z.number().optional().nullable(),
  // cd_number: z.number().optional().nullable(),
  file_name: z.string().optional().nullable(),
});

export const RelatedLinkSchema = z.object({
  // label: z.string().optional().nullable(),
  // url: z.string().optional().nullable(),
  img_url: z.string().optional().nullable(),
});

export const FeatureDetailsSchema = z.object({
  // feature_id: z.number().optional().nullable(),
  // feature_type: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
  title: z.string().optional().nullable(),
  // movie_name: z.string().optional().nullable(),
  // imdb_id: z.number().optional().nullable(),
  // tmdb_id: z.number().optional().nullable(),
});

export const UploaderSchema = z.object({
  // uploader_id: z.number().optional().nullable(),
  name: z.string().optional().nullable(),
  // rank: z.string().optional().nullable(),
});

export const AttributesSchema = z.object({
  // subtitle_id: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  // download_count: z.number().optional().nullable(),
  // new_download_count: z.number().optional().nullable(),
  // hearing_impaired: z.boolean().optional().nullable(),
  // hd: z.boolean().optional().nullable(),
  // fps: z.number().optional().nullable(),
  // votes: z.number().optional().nullable(),
  // ratings: z.number().optional().nullable(),
  // from_trusted: z.boolean().optional().nullable(),
  // foreign_parts_only: z.boolean().optional().nullable(),
  // upload_date: z.string().optional().nullable(),
  // file_hashes: z.array(z.any()),
  // ai_translated: z.boolean().optional().nullable(),
  // nb_cd: z.number().optional().nullable(),
  // slug: z.string().optional().nullable(),
  // machine_translated: z.boolean().optional().nullable(),
  // release: z.string().optional().nullable(),
  // comments: z.string().optional().nullable(),
  // legacy_subtitle_id: z.number().optional().nullable(),
  // legacy_uploader_id: z.number().optional().nullable(),
  uploader: UploaderSchema.optional().nullable(),
  feature_details: FeatureDetailsSchema.optional().nullable(),
  // url: z.string().optional().nullable(),
  related_links: z.array(RelatedLinkSchema).optional(),
  files: z.array(FileSchema),
});

export const MovieSchema = z.object({
  // id: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  attributes: AttributesSchema.optional().nullable(),
});

export const SubtitlesSchema = z.object({
  total_pages: z.number().optional().nullable(),
  // total_count: z.number().optional().nullable(),
  // per_page: z.number().optional().nullable(),
  // page: z.number().optional().nullable(),
  data: z.array(MovieSchema).optional().nullable(),
});

export const DownloadMetaSchema = z.object({
  link: z.string().optional().nullable(),
  // file_name: z.string().optional().nullable(),
  // requests: z.number().optional().nullable(),
  // remaining: z.number().optional().nullable(),
  // message: z.string().optional().nullable(),
  // reset_time: z.string().optional().nullable(),
  // reset_time_utc: z.string().optional().nullable(),
  // uk: z.string().optional().nullable(),
  // uid: z.number().optional().nullable(),
  // ts: z.number().optional().nullable(),
});
