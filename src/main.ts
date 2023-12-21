import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ResInterceptor } from '@/common/interceptor/res.interceptor';
import { ErrorFilter } from '@/common/filter/error.filter';
import { ValidateErrorFilter } from './common/filter/validate-error.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exception/validate.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe({
    // validationError: { value: true, target: true },
    stopAtFirstError: true,
    exceptionFactory: (errors: ValidationError[]) => {
      // console.log(errors)
      throw new ValidationException(errors)
      // return errors
    }
  }));
  app.useGlobalFilters(new ErrorFilter(), new ValidateErrorFilter())
  app.useGlobalInterceptors(new ResInterceptor())
  app.setGlobalPrefix('/api/')
  const port = Number(config.get('SERVER_PORT') || 3000)
  await app.listen(port);
}
bootstrap();
