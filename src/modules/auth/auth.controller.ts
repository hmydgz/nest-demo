import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return await this.authService.login(body)
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body)
  }
}
