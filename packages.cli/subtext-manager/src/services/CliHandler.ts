import type { Database } from '@get-subtext/lib.database';
import type { HelpDesk } from '@get-subtext/lib.help-desk';
import type * as T from './CliHandler.types';

export class CliHandler {
  public constructor(
    private readonly helpDesk: HelpDesk,
    private readonly database: Database
  ) {}

  public async handleHelpDesk({ issueNumber }: T.HandleHelpDeskInput) {
    await this.helpDesk.processIssue(issueNumber);
  }

  public async handleIndexQueries({ userId }: T.IndexQueriesInput) {
    await this.database.indexQueries(userId);
  }
}
