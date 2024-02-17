import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { LogCtx, Logger, LoggerCtx } from '@/common/decorator/logger.decorator';

@Logger()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO, @LoggerCtx() ctx: LogCtx) {
    return await this.authService.login(body, ctx)
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body)
  }
}
