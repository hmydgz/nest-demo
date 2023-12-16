import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/guard/token/token.guard';
import { UserReq } from 'src/typings';
import { UserService } from './user.service';
import { UseAuth } from 'src/guard/auth/auth.guard';
import { PermissionCodeEnum } from 'src/config/permission';

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
