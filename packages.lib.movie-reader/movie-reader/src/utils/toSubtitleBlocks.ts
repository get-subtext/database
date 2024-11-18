import { timeToMilliseconds } from './timeToMilliseconds';
import type { SubtitleBlock } from './toSubtitleBlocks.types';

export const toSubtitleBlocks = (srtContent: string): SubtitleBlock[] => {
  const blocks: SubtitleBlock[] = [];

  const subtitleChunks = srtContent.split(/\n\s*\n/);
  subtitleChunks.forEach((chunk) => {
    const lines = chunk.trim().split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0], 10);
      const [startTime, endTime] = lines[1].split(' --> ').map((s) => s.trim());
      const text = lines
        .slice(2)
        .map((s) => s.trim())
        .join('<br />');
      blocks.push({ index, start: timeToMilliseconds(startTime), end: timeToMilliseconds(endTime), text });
    }
  });

  return blocks;
};
