import { User } from '@app/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class AppService {
  constructor(
    @Inject(User.name) private readonly userModel: ReturnModelType<typeof User>,
  ) {}
  async getHello() {
    return await this.userModel.findOne();
  }

  test() {
    return 'AppService'
  }
}
