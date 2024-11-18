import { LogLevelEnum } from '@studio-75/lib.logging';
import { MappedLoggerFactory } from '@studio-75/lib.logging.mapped';
import { SecureLoggerFactory } from '@studio-75/lib.logging.secure';
import { colorize } from 'json-colorizer';
import { isEmpty, last, split } from 'lodash-es';
import { createLogger, format, transports } from 'winston';
import { rootDir } from '../rootDir';
import { getPkgMeta } from '../utils/getPkgMeta';
import { commonConfig } from './config';

const redactKeys = ['token', 'apiKey', 'Api-Key', 'Authorization'];

const consoleFormat = format.combine(
  format.colorize({ level: true }),
  format.printf(({ level, message, ...data }) => {
    const dataAsText = isEmpty(data) ? '' : colorize(data);
    return `${logPrefix} ${level} ${message} ${dataAsText}`;
  })
);

const consoleTransport = new transports.Console({ format: consoleFormat });
const winstonLogger = createLogger({ level: commonConfig.logLevel, transports: consoleTransport });

const loggerWinston = MappedLoggerFactory.create({
  instance: winstonLogger,
  levelMappings: { [LogLevelEnum.Trace]: LogLevelEnum.Debug, [LogLevelEnum.Fatal]: LogLevelEnum.Error },
});

export const pkgMeta = getPkgMeta(rootDir);
export const logPrefix = last(split(pkgMeta.name, '/'))!;
export const logger = SecureLoggerFactory.create({ redactKeys, instance: loggerWinston });
