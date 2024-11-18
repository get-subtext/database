import { get, isNil } from 'lodash-es';
import type * as T from './HelpDesk.types';
import type { IssueHandler } from './IssueHandler.types';
import type { IssueManager } from './IssueManager.types';
import { ReadOutputCodeEnum } from './IssueManager.types';

export class HelpDesk implements T.HelpDesk {
  public constructor(
    private readonly botLabel: string,
    private readonly issueManager: IssueManager,
    private readonly issueHandlers: Record<string, IssueHandler>,
    private readonly tap?: T.HelpDeskTap
  ) {}

  public async processIssue(issueNumber: string) {
    this.tap?.processIssueStarted(issueNumber);

    const readIssueRes = await this.issueManager.readIssue(issueNumber);
    switch (readIssueRes.code) {
      case ReadOutputCodeEnum.NotAutomated:
        this.tap?.processIssueFinishedIgnoredNoBotLabel(issueNumber, this.botLabel);
        break;
      case ReadOutputCodeEnum.AutomatedNoData:
        this.tap?.processIssueFinishedNoDataError(issueNumber);
        break;
      case ReadOutputCodeEnum.AutomatedParseError:
        this.tap?.processIssueFinishedParseError(issueNumber, readIssueRes.rawData);
        break;
      case ReadOutputCodeEnum.Automated:
        const type = get(readIssueRes.data, 'type');
        if (isNil(type)) {
          this.tap?.processIssueFinishedNoTypeError(issueNumber, readIssueRes.data);
        } else {
          const issueHandler = this.issueHandlers[type];
          if (isNil(issueHandler)) {
            this.tap?.processIssueFinishedInvalidTypeError(issueNumber, readIssueRes.data, type);
          } else {
            await issueHandler.handle(issueNumber, readIssueRes.data);
            this.tap?.processIssueFinished(issueNumber, readIssueRes.data, type);
          }
        }

        break;
    }
  }
}
