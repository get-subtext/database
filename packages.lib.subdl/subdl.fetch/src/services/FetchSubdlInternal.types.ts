import { z } from 'zod';
import * as S from '../schemas/SubdlSchemas';

export type Result = z.infer<typeof S.ResultSchema>;
export type Subtitle = z.infer<typeof S.SubtitleSchema>;
export type Movie = z.infer<typeof S.MovieSchema>;

export interface FetchSubdlInternal {
  getMovie: (imdbId: string) => Promise<Movie>;
  downloadFile: (url: string) => Promise<ArrayBuffer>;
}
