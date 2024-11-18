import type { HelpDeskConfig } from '@get-subtext/lib.help-desk';
import type { GitHubIssueManagerConfig } from '@get-subtext/lib.help-desk.issue-manager.github';
import type { SubdlMovieReaderConfig } from '@get-subtext/lib.movie-reader.subdl';
import type { CacheOmdbConfig } from '@get-subtext/lib.omdb.cache';
import type { FetchOmdbConfig } from '@get-subtext/lib.omdb.fetch';
import type { CacheOpenSubtitlesConfig } from '@get-subtext/lib.open-subtitles.cache';
import type { FetchOpenSubtitlesConfig } from '@get-subtext/lib.open-subtitles.fetch';
import type { CacheSubdlConfig } from '@get-subtext/lib.subdl.cache';
import type { FetchSubdlConfig } from '@get-subtext/lib.subdl.fetch';
import type { SubTextConfig } from '@get-subtext/lib.subtext.file-system';
import type { FileSystemCacheConfig } from '@studio-75/lib.cache.file-system';
import { cleanEnv, str } from 'envalid';
import path from 'path';
import { rootDir as projectDir } from '../rootDir';
import type { CommonConfig } from './config.types';

export const rootDir = path.resolve(projectDir, '..', '..');
export const OneWeekMs = 1000 * 60 * 60 * 24 * 7;
export const zipUrlBase = 'https://dl.subdl.com';
export const botLabel = 'subtext-bot';

export const environment = cleanEnv(process.env, {
  // Common Config
  NODE_ENV: str({}),
  LOG_LEVEL: str({}),
  // GitHub Config
  REPO_TOKEN: str({}),
  REPO_OWNER: str({}),
  REPO_NAME: str({}),
  // OMDB Config
  OMDB_API_KEY: str({}),
  // Open Subtitles Config
  OPEN_SUBTITLES_API_KEY: str({}),
  // SUBDL Config
  SUBDL_API_KEY: str({}),
});

export const commonConfig: CommonConfig = {
  environment: environment.NODE_ENV,
  logLevel: environment.LOG_LEVEL,
};

export const fileSystemCacheConfig: FileSystemCacheConfig = {
  cacheDir: path.resolve(rootDir, '__cache__'),
};

export const fetchOmdbConfig: FetchOmdbConfig = {
  apiKey: environment.OMDB_API_KEY,
  apiUrlBase: 'https://www.omdbapi.com',
};

export const cacheOmdbConfig: CacheOmdbConfig = {
  ttl: OneWeekMs,
};

export const fetchOpenSubtitlesConfig: FetchOpenSubtitlesConfig = {
  apiKey: environment.OPEN_SUBTITLES_API_KEY,
  apiUrlBase: 'https://api.opensubtitles.com/api/v1',
};

export const cacheOpenSubtitlesConfig: CacheOpenSubtitlesConfig = {
  ttl: OneWeekMs,
};

export const fetchSubdlConfig: FetchSubdlConfig = {
  apiKey: environment.SUBDL_API_KEY,
  apiUrlBase: 'https://api.subdl.com/api/v1/subtitles',
  zipUrlBase,
};

export const cacheSubdlConfig: CacheSubdlConfig = {
  ttl: OneWeekMs,
};

export const subdlMovieReaderConfig: SubdlMovieReaderConfig = {
  zipUrlBase,
};

export const subTextConfig: SubTextConfig = {
  rootDir: path.resolve(rootDir, '__data__'),
};

export const issueManagerConfig: GitHubIssueManagerConfig = {
  apiToken: environment.REPO_TOKEN,
  apiUrlBase: `https://api.github.com/repos/${environment.REPO_OWNER}/${environment.REPO_NAME}`,
  botLabel,
  dataSeparator: '===',
};

export const helpDeskConfig: HelpDeskConfig = {
  botLabel,
};
