import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create.dto';
import { TokenGuard } from '@/common/guard/token/token.guard';

@UseGuards(TokenGuard)
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {}

  @Post()
  async create(@Body() data: CreateRoleDTO) {
    return await this.roleService.create(data)
  }

  @Get()
  async findAll() {
    return await this.roleService.findAll()
  }
}
