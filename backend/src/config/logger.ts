import winston from 'winston';
import { getConfig } from './env';

let logger: winston.Logger;

export function createLogger(): winston.Logger {
  const config = getConfig();
  const isDevelopment = config.NODE_ENV === 'development';

  logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      winston.format.errors({ stack: true }),
      isDevelopment
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, stack, ...meta }) => {
                const metaStr = Object.keys(meta).length
                  ? ' ' + JSON.stringify(meta, null, 0)
                  : '';
                const stackStr = stack ? '\n' + stack : '';
                return `${timestamp} [${level}]: ${message}${metaStr}${stackStr}`;
              }
            )
          )
        : winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      ...(isDevelopment
        ? []
        : [
            new winston.transports.File({
              filename: 'logs/error.log',
              level: 'error',
              maxsize: 10 * 1024 * 1024, // 10 MB
              maxFiles: 5,
            }),
            new winston.transports.File({
              filename: 'logs/combined.log',
              maxsize: 10 * 1024 * 1024,
              maxFiles: 5,
            }),
          ]),
    ],
  });

  return logger;
}

export function getLogger(): winston.Logger {
  if (!logger) {
    return createLogger();
  }
  return logger;
}