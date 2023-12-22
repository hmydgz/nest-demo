import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@app/db';
import { User, Role, News } from '@app/db/schemas';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from './modules/role/role.module';
import { RedisModule } from '@app/redis';
import { JWT_SECRET_ENV_KEY } from './config/keys';
import { NewsModule } from './modules/news/news.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HeaderGuard } from './common/guard/header/header.guard';
import { ErrorFilter } from './common/filter/error.filter';
import { CustomErrorFilter } from './common/filter/custom-exception.filter';
import { ValidateErrorFilter } from './common/filter/validate-error.filter';
import { ValidationException } from './common/exception/validate.exception';
import { ResInterceptor } from './common/interceptor/res.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DbModule.forRoot('MONGODB_URI', {}),
    DbModule.forFeature([
      User,
      Role,
      News,
    ]),
    RedisModule.forRoot('REDIS_URI'),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(JWT_SECRET_ENV_KEY),
        global: true,
        signOptions: {
          expiresIn: '3d',
        },
      })
    }),
    UserModule,
    AuthModule,
    RoleModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局管道
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        stopAtFirstError: true,
        exceptionFactory: (errors: ValidationError[]) => { throw new ValidationException(errors) }
      })
    },
    // 全局守卫
    { provide: APP_GUARD, useClass: HeaderGuard },
    // 全局过滤器
    ...([ErrorFilter, ValidateErrorFilter, CustomErrorFilter]).map(v => ({ provide: APP_FILTER, useClass: v })),
    // 全局拦截器
    { provide: APP_INTERCEPTOR, useClass: ResInterceptor },
  ],
})
export class AppModule { }
