import type * as T from '@get-subtext/lib.database';
import type { Logger } from '@studio-75/lib.logging';
import { gray, magenta } from 'colorette';

export class DatabaseTap implements T.DatabaseTap {
  public constructor(
    private readonly verbose: boolean,
    private readonly issueProcessor: string,
    private readonly logger: Logger
  ) {}

  public indexQueriesStarted() {
    this.logger.info('');
    this.logger.info(`${magenta('=== Database ===')}`);

    const message = this.messagePrefix();
    if (this.verbose) {
      this.logger.info(`${message} indexing queries started`, {});
    } else {
      this.logger.info(`${message} indexing queries started`);
    }
  }

  public indexQueriesFinished() {
    const message = this.messagePrefix() + ` indexing queries finished`;
    if (this.verbose) {
      this.logger.info(message, {});
    } else {
      this.logger.info(message);
    }

    this.logger.info('');
  }

  private messagePrefix() {
    return `${gray('[' + this.issueProcessor + ']')}`;
  }
}
