import type { IssueHandler } from '@get-subtext/lib.help-desk';
import type { SyncMovieIssueHandlerOptions } from './index.types';
import { SyncMovieIssueHandler } from './services/SyncMovieIssueHandler';

export type * from './index.types';

export const syncMovieKey = 'SYNC_MOVIE';

export class SyncMovieIssueHandlerFactory {
  private constructor() {}

  public static create({ issueManager, syncMovieCommand, subText }: SyncMovieIssueHandlerOptions): IssueHandler {
    return new SyncMovieIssueHandler(issueManager, syncMovieCommand, subText);
  }
}
