import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from '../role/role.module';

@Global()
@Module({
  imports: [
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
  ],
  exports: [
    AuthService,
    JwtService,
    UserModule,
  ]
})
export class AuthModule {}
