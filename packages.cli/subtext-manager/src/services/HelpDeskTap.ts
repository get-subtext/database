import type * as T from '@get-subtext/lib.help-desk';
import type { Logger } from '@studio-75/lib.logging';
import { cyan, gray, green, magenta } from 'colorette';

export class HelpDeskTap implements T.HelpDeskTap {
  public constructor(
    private readonly verbose: boolean,
    private readonly issueProcessor: string,
    private readonly logger: Logger
  ) {}

  public processIssueStarted(issueNumber: string) {
    this.logger.info('');
    this.logger.info(`${magenta('=== Processing Issue ' + issueNumber + ' ===')}`);

    const message = this.messagePrefix(issueNumber);
    if (this.verbose) {
      this.logger.info(`${message} processing started`, { issueNumber });
    } else {
      this.logger.info(`${message} processing started`);
    }
  }

  public processIssueFinishedIgnoredNoBotLabel(issueNumber: string, label: string) {
    const message = this.messagePrefix(issueNumber);
    this.logger.info(`${message} Ignoring this issue as it is not for automation`);
    this.logger.info(`${message} If this was in error, make sure the issue:`);
    this.logger.info(`${message} - has a ${green(label)} label`);
    this.logger.info(`${message} - has yaml data in its body which includes a 'type' field`);
  }

  public processIssueFinishedNoDataError(issueNumber: string) {
    const message = this.messagePrefix(issueNumber) + ` the issue has no yaml data`;
    if (this.verbose) {
      this.logger.error(message, { issueNumber });
    } else {
      this.logger.error(message);
    }
  }

  public processIssueFinishedParseError(issueNumber: string, rawData: string) {
    const message = this.messagePrefix(issueNumber) + ` the issue invalid yaml data`;
    if (this.verbose) {
      this.logger.error(message, { issueNumber, rawData });
    } else {
      this.logger.error(message);
    }
  }

  public processIssueFinishedNoTypeError(issueNumber: string, data: any) {
    const message = this.messagePrefix(issueNumber) + ` the issue has no 'type' field in its yaml data`;
    if (this.verbose) {
      this.logger.error(message, { issueNumber, data });
    } else {
      this.logger.error(message);
    }
  }

  public processIssueFinishedInvalidTypeError(issueNumber: string, data: any, type: string) {
    const message = this.messagePrefix(issueNumber) + ` The issue has an invalid 'type' field in its yaml data: '${green(type)}'`;
    if (this.verbose) {
      this.logger.error(message, { issueNumber, data });
    } else {
      this.logger.error(`${message} ${type}`);
    }
  }

  public processIssueFinished(issueNumber: string, data: any, type: string) {
    const message = this.messagePrefix(issueNumber) + ` processing finished`;
    if (this.verbose) {
      this.logger.info(message, { issueNumber, data });
    } else {
      this.logger.info(message);
    }

    this.logger.info('');
  }

  private messagePrefix(issueNumber: string) {
    return `${gray('[' + this.issueProcessor + ']')} ${cyan('Issue ' + issueNumber)}`;
  }
}
