import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './infrastructure/monitoring/custom.logger';

// Polyfill for crypto in Node.js 18
if (!globalThis.crypto) {
  const crypto = require('crypto');
  globalThis.crypto = crypto.webcrypto || crypto;
}

async function bootstrap() {
  const customLogger = new CustomLogger('NestApplication');
  
  const app = await NestFactory.create(AppModule, {
    logger: customLogger,
  });
  
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:80', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  const logger = new CustomLogger('Bootstrap');
  logger.log(`Candidates API is running on port ${port}`);
}

bootstrap();