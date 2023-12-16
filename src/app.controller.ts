import { AppService } from '@/app.service';
import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@app/db/schemas';
import { PermissionCodeEnum } from '@/config/permission';
import { ProvideEnum } from '@/config/provide';
import { RedisClient } from '@/typings';
import { TokenGuard } from '@/common/guard/token/token.guard';
import { UseAuth } from '@/common/guard/auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(User.name) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(ProvideEnum.REDIS_CLIENT) private readonly redisClient: RedisClient
  ) {}

  @Get()
  getHello() {
    console.log('appService', this.appService.test())
    return {}
  }

  @Get('test')
  async getTest() {
    return await this.userModel.find()
  }

  @Get('test2')
  @UseAuth(PermissionCodeEnum.GET_USER_LIST)
  async getTest2(/* @Req() req: Request & { user: User & { id: string } } */) {
    // const _key = RedisKeys.rolePermissionSet(req.user.id)
    // await this.redisClient.SADD(_key, String(Date.now()))
    // const res = await this.redisClient.SMEMBERS(_key)
    // return res
    return 'ok'
  }



  @UseGuards(TokenGuard)
  @Post('clear/redis')
  async clearRedis() {
    const keys = await this.redisClient.keys('*')
    await this.redisClient.del(keys)
    return keys
  }

  @Get('redis/:key')
  async getRedisKey(@Param('key') key: string) {
    const type = await this.redisClient.type(key)
    switch (type) {
      case 'string': {
        const res = await this.redisClient.get(key)
        try {
          return JSON.parse(res)
        } catch (error) {
          return res
        }
      }
      case 'set': return await this.redisClient.sMembers(key)
    }
    return await this.redisClient.get(key)
  }
}
