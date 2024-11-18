import type { SyncMovieCommand } from '@get-subtext/lib.command.sync-movie';
import type { IssueManager } from '@get-subtext/lib.help-desk';
import type { SubText } from '@get-subtext/lib.subtext';

export interface SyncMovieIssueHandlerOptions {
  issueManager: IssueManager;
  syncMovieCommand: SyncMovieCommand;
  subText: SubText;
}
