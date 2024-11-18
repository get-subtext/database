import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as config from './composition/config';
import { logger } from './composition/logging';
import { createHandler } from './composition/services';
import * as callHelpDesk from './constants/callHelpDesk';
import * as common from './constants/common';
import * as indexDb from './constants/index';

logger.debug('Using config', config);

yargs(hideBin(process.argv))
  .usage('Usage: subtext-manager <command> [options]')
  .command(
    callHelpDesk.command,
    callHelpDesk.description,
    (yargs) =>
      yargs
        .option(callHelpDesk.issueNumberName, {
          alias: callHelpDesk.issueNumberAlias,
          describe: callHelpDesk.issueNumberDescribe,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => createHandler(args.verbose).handleHelpDesk(args)
  )
  .command(
    indexDb.command,
    indexDb.description,
    (yargs) =>
      yargs
        .option(indexDb.optionUserIdName, {
          alias: indexDb.optionUserIdAlias,
          description: indexDb.optionUserIdDescription,
          type: 'string',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => createHandler(args.verbose).handleIndexQueries(args)
  )

  .parse();
