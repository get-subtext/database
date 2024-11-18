import { includes } from 'lodash-es';
import type { SubtitleFile } from '../services/MovieReader.types';

export const compactSubtitleFiles = (subtitleFiles: SubtitleFile[]): SubtitleFile[] => {
  const output: SubtitleFile[] = [];
  const subtitleFileIds: string[] = [];
  for (let i = 0; i < subtitleFiles.length; i++) {
    const subtitleFile = subtitleFiles[i];
    if (!includes(subtitleFileIds, subtitleFile.subtitleFileId)) {
      output.push(subtitleFile);
      subtitleFileIds.push(subtitleFile.subtitleFileId);
    }
  }

  return output;
};
