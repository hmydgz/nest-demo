import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/guard/token/token.guard';
import { RoleService } from './role.service';
import { CreateRoleDTO } from './dto/create.dto';

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
