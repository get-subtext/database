import { toSubtitleBlocks } from './toSubtitleBlocks';

export const toSubtitles = (srtContent: string): string[] => {
  const blocks = toSubtitleBlocks(srtContent);
  const lines: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const { start, end, text } = blocks[i];
    lines.push(`${start} ${end} ${text}`);
  }

  return lines;
};
