import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);
  private readonly logLevel = process.env.LOG_LEVEL || 'info';

  private readonly fileLogger = winston.createLogger({
    level: this.logLevel,
    transports: [
      new winston.transports.Console(),
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '14d',
      }),
    ],
  });

  logRequest(method: string, url: string, query: any, body: any): void {
    if (this.shouldLog('info')) {
      const message = `[${method}] Request to ${url}, Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`;
      this.logger.log(message);
      this.fileLogger.info(message);
    }
  }

  logResponse(statusCode: number, data: any): void {
    if (this.shouldLog('info')) {
      const message = `Response: Status ${statusCode}, Data: ${JSON.stringify(data)}`;
      this.logger.log(message);
      this.fileLogger.info(message);
    }
  }

  logError(error: any): void {
    const message = `Error: ${error.message}`;
    this.logger.error(message, error.stack);
    this.fileLogger.error(message, { stack: error.stack });
  }

  logDebug(message: string): void {
    if (this.shouldLog('debug')) {
      this.logger.debug(message);
      this.fileLogger.debug(message);
    }
  }

  logWarning(message: string): void {
    if (this.shouldLog('warn')) {
      this.logger.warn(message);
      this.fileLogger.warn(message);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}
