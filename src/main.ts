import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ResInterceptor } from '@/common/interceptor/res.interceptor';
import { ErrorFilter } from '@/common/filter/error.filter';
import { HeaderGuard } from '@/common/guard/header/header.guard';
// import { ErrorInterceptor } from './interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService)
  app.useGlobalGuards(new HeaderGuard())
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ErrorFilter())
  app.useGlobalInterceptors(
    // new ErrorInterceptor(),
    new ResInterceptor(),
  )
  app.setGlobalPrefix('/api/')
  const port = Number(config.get('SERVER_PORT') || 3000)
  await app.listen(port);
}
bootstrap();
