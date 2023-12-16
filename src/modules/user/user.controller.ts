import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserReq } from 'src/typings';
import { UserService } from './user.service';
import { PermissionCodeEnum } from 'src/config/permission';
import { TokenGuard } from '@/common/guard/token/token.guard';
import { UseAuth } from '@/common/guard/auth/auth.guard';

@UseGuards(TokenGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseAuth(PermissionCodeEnum.GET_USER_LIST)
  @Get()
  async getUser() {
    return await this.userService.getUserList()
  }

  @Post('setRole')
  async setRole(@Req() req: UserReq, @Body() body: { roleId: string }) {
    return await this.userService.setRole(req.user._id, body.roleId)
  }
}
