import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { MyLoggerService, logger } from './common/logger';
import 'reflect-metadata';

async function bootstrap() {
  logger.info(`--------------------- start --------------------`)
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new MyLoggerService()
  });
  const config = app.get(ConfigService)
  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI })
  const port = Number(config.get('SERVER_PORT') || 3000)
  await app.listen(port);
}
bootstrap()