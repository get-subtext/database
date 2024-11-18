import type * as T from '@get-subtext/lib.help-desk';
import { ReadOutputCodeEnum } from '@get-subtext/lib.help-desk';
import { find, isNil } from 'lodash-es';
import { parse } from 'yaml';
import type { GitHub } from './GitHub.types';

export class GitHubIssueManager implements T.IssueManager {
  public constructor(
    private readonly dataSeparator: string,
    private readonly botLabel: string,
    private readonly gitHub: GitHub
  ) {}

  public async readIssue(issueNumber: string): Promise<T.Issue> {
    const issue = await this.gitHub.getIssue(<any>issueNumber);

    if (issue === null) throw new Error(`[${GitHubIssueManager.name}] ${this.readIssue.name} failed: could not find issue '${issueNumber}' `);

    const label = find(issue.labels, (l) => l.name === this.botLabel);
    if (isNil(label)) return { code: ReadOutputCodeEnum.NotAutomated };

    const rawData = this.getRawData(issue.body ?? '');
    if (isNil(rawData)) return { code: ReadOutputCodeEnum.AutomatedNoData };

    try {
      const data = parse(rawData);
      return { code: ReadOutputCodeEnum.Automated, data };
    } catch {
      return { code: ReadOutputCodeEnum.AutomatedParseError, rawData };
    }
  }

  public async closeIssue(issueNumber: string, comment: string, labels: string[]) {
    try {
      await this.gitHub.addIssueComment(<any>issueNumber, comment);
      await this.gitHub.addIssueLabels(<any>issueNumber, labels);
      await this.gitHub.closeIssue(<any>issueNumber);
    } catch (cause) {
      throw new Error(`[${GitHubIssueManager.name}] ${this.closeIssue.name} failed: issue '${issueNumber}'`, { cause });
    }
  }

  private getRawData(issueBody: string) {
    const separatorIndex = issueBody.indexOf(this.dataSeparator);
    if (separatorIndex === -1) return null;

    const rawData = issueBody.slice(separatorIndex + 3).trim();
    return rawData;
  }
}
