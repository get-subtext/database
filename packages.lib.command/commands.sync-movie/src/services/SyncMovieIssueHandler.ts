import type { IssueHandler, IssueManager } from '@get-subtext/lib.help-desk';
import type { SyncMovieCommand, SyncMovieCommandRequest } from '@get-subtext/lib.helpdesk.issue-handler.sync-movie';
import { emptyTitle } from '@get-subtext/lib.movie-reader';
import { join } from 'lodash-es';

export const syncMovieKey = 'SYNC_MOVIE';

export class SyncMovieIssueHandler implements IssueHandler {
  public constructor(
    private readonly issueManager: IssueManager,
    private readonly syncMovieCommand: SyncMovieCommand
  ) {}

  public async handle(issueNumber: string, request: SyncMovieCommandRequest) {
    const movie = await this.syncMovieCommand.run(request);

    const success = movie !== null;
    const title = success ? movie.title : emptyTitle;
    const subtitleCount = success ? movie.subtitleFiles.length : 0;
    const fileP11n = subtitleCount === 1 ? 'file' : 'files';

    const issueComments: string[] = [];
    issueComments.push(`:clapper: **${title}**`);
    issueComments.push(`- ${subtitleCount} valid subtitle ${fileP11n} found`);
    await this.issueManager.closeIssue(issueNumber, join(issueComments, '\n'), []);
  }
}
