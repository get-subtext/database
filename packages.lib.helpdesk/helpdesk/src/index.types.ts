import type { HelpDeskTap } from './services/HelpDesk.types';
import type { IssueHandler } from './services/IssueHandler.types';
import type { IssueManager } from './services/IssueManager.types';

export interface HelpDeskConfig {
    botLabel: string;
}

export interface HelpDeskOptions {
  config: HelpDeskConfig;
  issueManager: IssueManager;
  issueHandlers: Record<string, IssueHandler>;
  tap?: HelpDeskTap;
}
