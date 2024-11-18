import type { IssueManager } from '@get-subtext/lib.help-desk';
import type { GitHubIssueManagerOptions } from './index.types';
import { FetchGitHub } from './services/GitHub';
import { GitHubIssueManager } from './services/GitHubIssueManager';

export type * from './index.types';

export class GitHubIssueManagerFactory {
  private constructor() {}

  public static create({ config, fetch }: GitHubIssueManagerOptions): IssueManager {
    const gitHub = new FetchGitHub(config.apiToken, config.apiUrlBase, fetch);
    return new GitHubIssueManager(config.dataSeparator, config.botLabel, gitHub);
  }
}
