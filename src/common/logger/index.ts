import 'winston-daily-rotate-file'
import * as winston from 'winston';
import { ConsoleLogger } from '@nestjs/common';

export const logger = winston.createLogger({
  transports: [
    // new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      dirname: `logs`, // 日志保存的目录
      filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
      datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
      maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
      // 记录时添加时间戳信息
      format: winston.format.combine(
        // winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, ...rest }) => {
          return `${new Date().toISOString()} ${level}: ${message} ${JSON.stringify(rest)}`;
        }),
      ),
    })
  ],
})

export class MyLoggerService extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]): void {
    super.log(message, ...optionalParams)
    logger.info(message, ...optionalParams)
  }

  error(message: any, stackOrContext?: string): void;
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: any[]): void;
  error(message: any, stack?: unknown, context?: unknown, ...rest: unknown[]): void {
    super.error(message, stack, context, ...rest)
    logger.error(message, stack, context, ...rest)
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: any[]): void;
  warn(message: any, context?: unknown, ...rest: unknown[]): void {
    super.warn(message, context, ...rest)
    logger.warn(message, context, ...rest)
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: any[]): void;
  verbose(message: any, context?: unknown, ...rest: unknown[]): void {
    super.verbose(message, context, ...rest)
    logger.verbose(message, context, ...rest)
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: any[]): void;
  debug(message: any, context?: unknown, ...rest: unknown[]): void {
    super.debug(message, context, ...rest)
    logger.debug(message, context, ...rest)
  }
}