import type { Movie, SyncMovieCommand, SyncMovieCommandRequest } from '@get-subtext/lib.command.sync-movie';
import type { IssueHandler, IssueManager } from '@get-subtext/lib.help-desk';
import { emptyTitle } from '@get-subtext/lib.movie-reader';
import type { SubText } from '@get-subtext/lib.subtext';
import { RequestResultEnum } from '@get-subtext/lib.subtext';
import { join } from 'lodash-es';

export class SyncMovieIssueHandler implements IssueHandler<SyncMovieCommandRequest> {
  public constructor(
    private readonly issueManager: IssueManager,
    private readonly syncMovieCommand: SyncMovieCommand,
    private readonly subText: SubText
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

    const result = this.getResult(movie);
    await this.subText.writeRequestIndex({ requestId: request.requestId, userId: request.userId, imdbId: request.imdbId, result });
  }

  private getResult(movie: Movie | null) {
    if (movie === null) return RequestResultEnum.NotFound;
    if (movie.subtitleFiles.length === 0) return RequestResultEnum.FoundNoSubtitles;
    return RequestResultEnum.FoundWithSubtitles;
  }
}
