import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const loggingService = app.get(LoggingService);

    app.useGlobalPipes(new ValidationPipe());

    const PORT = process.env.PORT || 4000;

    await app.listen(PORT, '0.0.0.0');

    loggingService.logDebug(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Application startup error:', error);
    process.exit(1);
  }
}

bootstrap();

process.on('uncaughtException', (error) => {
  const loggingService = new LoggingService();
  loggingService.logError(error);
});

process.on('unhandledRejection', (reason) => {
  const loggingService = new LoggingService();
  loggingService.logError(reason);
});
