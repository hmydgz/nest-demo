import { RedisClient } from 'src/typings';
import { User } from '@app/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ProvideEnum } from '@/common/enums/provide.enum';
import { RedisKeys } from '@app/redis/keys';

@Injectable()
export class UserService {
  constructor(
    @Inject(User.name) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(ProvideEnum.REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  async findById(id: string) {
    try {
      return await this.userModel.findById(id).populate('roleId')
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async findOne(where: Partial<Omit<User, 'password'>> = {}) {
    const _where = Object.entries(where).map(([key, value]) => ({ [key]: value }))
    return await this.userModel.findOne({ $or: _where }).select('+password')
  }

  async getUserList() {
    return await this.userModel.find().populate('role')
  }

  async create(data: User) {
    return await this.userModel.create(data)
  }

  async setRole(userId: string, roleId: string) {
    await this.userModel.findByIdAndUpdate(userId, { roleId })
    await this.redisClient.del(RedisKeys.user(userId))
    return
  }
}
