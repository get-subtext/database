import { SyncMovieCommandFactory } from '@get-subtext/lib.command.sync-movie';
import { DatabaseFactory } from '@get-subtext/lib.database';
import { createFetchTap } from '@get-subtext/lib.fetch.tap';
import { HelpDeskFactory, IssueHandler } from '@get-subtext/lib.help-desk';
import { GitHubIssueManagerFactory } from '@get-subtext/lib.help-desk.issue-manager.github';
import { SyncMovieIssueHandlerFactory, syncMovieKey } from '@get-subtext/lib.helpdesk.issue-handler.sync-movie';
import { CompositeMovieReaderFactory } from '@get-subtext/lib.movie-reader.composite';
import { OmdbMovieReaderFactory } from '@get-subtext/lib.movie-reader.omdb';
import { OpenSubtitlesMovieReaderFactory } from '@get-subtext/lib.movie-reader.open-subtitles';
import { SubdlMovieReaderFactory } from '@get-subtext/lib.movie-reader.subdl';
import { SubTextMovieWriterFactory } from '@get-subtext/lib.movie-writer.subtext';
import { CacheOmdbFactory } from '@get-subtext/lib.omdb.cache';
import { FetchOmdbFactory } from '@get-subtext/lib.omdb.fetch';
import { CacheOpenSubtitlesFactory } from '@get-subtext/lib.open-subtitles.cache';
import { FetchOpenSubtitlesFactory } from '@get-subtext/lib.open-subtitles.fetch';
import { CacheSubdlFactory } from '@get-subtext/lib.subdl.cache';
import { FetchSubdlFactory } from '@get-subtext/lib.subdl.fetch';
import { SubTextFactory } from '@get-subtext/lib.subtext.file-system';
import { FileSystemCacheFactory } from '@studio-75/lib.cache.file-system';
import Bottleneck from 'bottleneck';
import { CliHandler } from '../services/CliHandler';
import { DatabaseTap } from '../services/DatabaseTap';
import { HelpDeskTap } from '../services/HelpDeskTap';
import { MovieReaderTap } from '../services/MovieReaderTap';
import { MovieWriterTap } from '../services/MovieWriterTap';
import { SyncMovieCommandTap } from '../services/SyncMovieCommandTap';
import { fetchBottleneck } from '../services/fetchBottleneck';
import { fetchTap } from '../services/fetchTap';
import * as config from './config';
import { logger } from './logging';

export const createHandler = (verbose: boolean) => {
  const fileSystemCache = FileSystemCacheFactory.create({ config: config.fileSystemCacheConfig });

  // Omdb
  const fetchOmdbTap = createFetchTap({ fetch, tap: fetchTap(logger, verbose) });
  const fetchOmdb = FetchOmdbFactory.create({ config: config.fetchOmdbConfig, fetch: fetchOmdbTap });
  const cacheOmdb = CacheOmdbFactory.create({ config: config.cacheOmdbConfig, instance: fetchOmdb, cache: fileSystemCache });
  const omdbMovieReaderTap = new MovieReaderTap(verbose, 'OmdbMovieReader', logger);
  const omdbMovieReader = OmdbMovieReaderFactory.create({ omdb: cacheOmdb, tap: omdbMovieReaderTap });

  // Open Subtitles
  // Note: Open subtitles has a rate limit of 5 requests per 1 second per IP address:
  // - https://opensubtitles.stoplight.io/docs/opensubtitles-api/6ef2e232095c7-best-practices#limits
  const limiter = new Bottleneck({ minTime: 250 }); // (4 requests per second)
  const fetchOpenSubtitlesTap = createFetchTap({ fetch: fetchBottleneck(fetch, limiter), tap: fetchTap(logger, verbose) });
  const fetchOpenSubtitles = FetchOpenSubtitlesFactory.create({ config: config.fetchOpenSubtitlesConfig, fetch: fetchOpenSubtitlesTap });
  const cacheOpenSubtitles = CacheOpenSubtitlesFactory.create({
    config: config.cacheOpenSubtitlesConfig,
    instance: fetchOpenSubtitles,
    cache: fileSystemCache,
  });
  const openSubtitlesMovieReaderTap = new MovieReaderTap(verbose, 'OpenSubtitlesMovieReader', logger);
  const openSubtitlesMovieReader = OpenSubtitlesMovieReaderFactory.create({ openSubtitles: cacheOpenSubtitles, tap: openSubtitlesMovieReaderTap });

  // Subdl
  const fetchSubdlTap = createFetchTap({ fetch, tap: fetchTap(logger, verbose) });
  const fetchSubdl = FetchSubdlFactory.create({ config: config.fetchSubdlConfig, fetch: fetchSubdlTap });
  const subdl = CacheSubdlFactory.create({ config: config.cacheSubdlConfig, instance: fetchSubdl, cache: fileSystemCache });
  const subdlMovieReaderTap = new MovieReaderTap(verbose, 'SubdlMovieReader', logger);
  const subdlMovieReader = SubdlMovieReaderFactory.create({ config: config.subdlMovieReaderConfig, subdl: subdl, tap: subdlMovieReaderTap });

  // Sync Movie Command
  const subText = SubTextFactory.create({ config: config.subTextConfig });
  const movieReaders = [omdbMovieReader, openSubtitlesMovieReader, subdlMovieReader];
  const compositeMovieReaderTap = new MovieReaderTap(verbose, 'CompositeMovieReader', logger);
  const compositeMovieReader = CompositeMovieReaderFactory.create({ movieReaders, tap: compositeMovieReaderTap });
  const subTextMovieWriterTap = new MovieWriterTap(verbose, 'SubTextMovieWriter', logger);
  const subTextMovieWriter = SubTextMovieWriterFactory.create({ subText, tap: subTextMovieWriterTap });
  const syncMovieCommandTap = new SyncMovieCommandTap(verbose, 'SyncMovieCommand', logger);
  const syncMovieCommand = SyncMovieCommandFactory.create({ movieReader: compositeMovieReader, movieWriter: subTextMovieWriter, tap: syncMovieCommandTap });

  // Help Desk
  const fetchGithubTap = createFetchTap({ fetch, tap: fetchTap(logger, verbose) });
  const issueManager = GitHubIssueManagerFactory.create({ config: config.issueManagerConfig, fetch: fetchGithubTap });
  const issueHandlers: Record<string, IssueHandler> = {};
  issueHandlers[syncMovieKey] = SyncMovieIssueHandlerFactory.create({ issueManager, syncMovieCommand, subText });
  const issueProcessorLogger = new HelpDeskTap(verbose, 'HelpDesk', logger);
  const helpDesk = HelpDeskFactory.create({ config: config.helpDeskConfig, issueManager, issueHandlers, tap: issueProcessorLogger });

  // Database
  const databaseTap = new DatabaseTap(verbose, 'Database', logger);
  const database = DatabaseFactory.create({ api: subText, tap: databaseTap });

  // CLI Handler
  const handler = new CliHandler(helpDesk, database);
  return handler;
};
