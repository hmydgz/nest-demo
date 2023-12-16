import { Role } from '@app/db/schemas/role.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateRoleDTO } from './dto/create.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject(Role.name) private readonly roleModel: ReturnModelType<typeof Role>
  ) {}

  async create(data: CreateRoleDTO) {
    return await this.roleModel.create(data)
  }

  async find(id: string) {
    return await this.roleModel.findById(id)
  }

  async findAll() {
    return await this.roleModel.find()
  }
}
