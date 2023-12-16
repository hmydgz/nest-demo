import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HeaderGuard } from './guard/header/header.guard'
import { ResInterceptor } from './interceptor/res.interceptor';
// import { ErrorInterceptor } from './interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService)
  app.useGlobalGuards(new HeaderGuard())
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters()
  app.useGlobalInterceptors(
    // new ErrorInterceptor(),
    new ResInterceptor(),
  )
  app.setGlobalPrefix('/api/')
  const port = Number(config.get('SERVER_PORT') || 3000)
  await app.listen(port);
}
bootstrap();
