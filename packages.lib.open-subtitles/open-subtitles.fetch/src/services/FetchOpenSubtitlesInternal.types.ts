import { z } from 'zod';
import * as S from '../schemas/OpenSubtitlesSchemas';

export type File = z.infer<typeof S.FileSchema>;
export type RelatedLink = z.infer<typeof S.RelatedLinkSchema>;
export type FeatureDetails = z.infer<typeof S.FeatureDetailsSchema>;
export type Uploader = z.infer<typeof S.UploaderSchema>;
export type Attributes = z.infer<typeof S.AttributesSchema>;
export type Movie = z.infer<typeof S.MovieSchema>;
export type Subtitles = z.infer<typeof S.SubtitlesSchema>;
export type DownloadMeta = z.infer<typeof S.DownloadMetaSchema>;

export interface FetchOpenSubtitlesInternal {
  getSubtitles: (imdbId: string, pageNumber: number) => Promise<Subtitles>;
  getDownloadMeta: (fileId: number) => Promise<DownloadMeta>;
  downloadFile: (url: string) => Promise<string>;
}
