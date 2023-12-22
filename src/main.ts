import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService)
  app.setGlobalPrefix('/api/')
  const port = Number(config.get('SERVER_PORT') || 3000)
  await app.listen(port);
}
bootstrap();
