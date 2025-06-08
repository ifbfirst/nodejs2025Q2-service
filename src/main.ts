import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const PORT = process.env.PORT || 4000;

    await app.listen(PORT, '0.0.0.0');

    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(
        ` Port ${process.env.PORT || 4000} is already in use, exiting...`,
      );

      process.exit(1);
    } else {
      console.error(' Application startup error:', error);

      process.exit(1);
    }
  }
}

bootstrap();
