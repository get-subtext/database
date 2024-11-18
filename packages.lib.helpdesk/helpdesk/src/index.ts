import type { HelpDeskOptions } from './index.types';
import { HelpDesk as HelpDeskImpl } from './services/HelpDesk';
import type { HelpDesk } from './services/HelpDesk.types';

export type * from './index.types';
export type * from './services/HelpDesk.types';
export type * from './services/IssueHandler.types';
export type * from './services/IssueManager.types';
export { ReadOutputCodeEnum } from './services/IssueManager.types';

export class HelpDeskFactory {
  private constructor() {}

  public static create({ config, issueManager, issueHandlers, tap }: HelpDeskOptions): HelpDesk {
    return new HelpDeskImpl(config.botLabel, issueManager, issueHandlers, tap);
  }
}
