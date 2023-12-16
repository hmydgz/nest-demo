import { Global, Module } from '@nestjs/common';
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

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    DbModule.forRoot('MONGODB_URI', {
      // auth: { username: 'root', password: 'b5r8CmrsrH0VpEWm' },
      // user: 'root', pass: 'b5r8CmrsrH0VpEWm',
    }),
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
  providers: [AppService],
})
export class AppModule {}
