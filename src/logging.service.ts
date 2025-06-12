import { Injectable, Logger } from '@nestjs/common';

@Injectable()
class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  logRequest(method: string, url: string, query: any, body: any): void {
    console.log(
      `[${method}] Request to ${url}, Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`,
    );
    this.logger.log(
      `[${method}] Request to ${url}, Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}`,
    );
  }

  logResponse(statusCode: number, data: any): void {
    this.logger.log(
      `Response: Status ${statusCode}, Data: ${JSON.stringify(data)}`,
    );
  }

  logError(error: any): void {
    this.logger.error(`Error: ${error.message}`, error.stack);
  }
}

export { LoggingService };
