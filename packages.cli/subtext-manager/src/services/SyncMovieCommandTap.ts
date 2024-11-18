import type * as T from '@get-subtext/lib.helpdesk.issue-handler.sync-movie';
import type { ILogger } from '@studio-75/lib.logging';
import { cyan, gray, green, red } from 'colorette';

export class SyncMovieCommandTap implements T.SyncMovieCommandTap {
  public constructor(
    private readonly verbose: boolean,
    private readonly movieSyncName: string,
    private readonly logger: ILogger
  ) {}

  public runStarted(syncRequest: T.SyncMovieCommandRequest) {
    const action = 'sync movie started';
    const prefix = this.getMsgPrefix(syncRequest.imdbId);
    const message = `${prefix} ${action}`;

    if (this.verbose) {
      this.logger.info(message, syncRequest);
    } else {
      this.logger.info(message);
    }
  }

  public runFinished(request: T.SyncMovieCommandRequest, movie: T.Movie | null, errors: Error[]) {
    const action = 'sync movie finished';
    const prefix = this.getMsgPrefix(request.imdbId);
    const message = `${prefix} ${action}`;

    const imdbId = request.imdbId;
    const subtitleFileCount = movie?.subtitleFiles.length ?? 0;

    if (this.verbose) {
      this.logger.info(message, { imdbId, subtitleFileCount, errors });
    } else {
      const errorP11n = errors.length === 1 ? 'error' : 'errors';
      const fileP11n = subtitleFileCount === 1 ? 'file' : 'files';
      const subtitlePart = `${subtitleFileCount === 0 ? red('no') : green(subtitleFileCount)} valid subtitle ${fileP11n}`;
      const errorPart = errors.length === 0 ? '' : ` (${red(errors.length + ' ' + errorP11n)})`;
      this.logger.info(`${message}: ${subtitlePart}${errorPart}`);
    }

    for (let i = 0; i < errors.length; i++) {
      this.logger.error(`${prefix}`, errors[i]);
    }
  }

  private getMsgPrefix(imdbId: string) {
    return `${gray('[' + this.movieSyncName + ']')} ${cyan(imdbId)}`;
  }
}
