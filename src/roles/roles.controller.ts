import { Body, Controller, Delete, Get, Inject, LoggerService, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { RolesService } from './roles.service'
import { Roles } from '../entities/roles/roles.entity'
import { AuthGuard } from '@nestjs/passport'

@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  // 查询所有角色
  @Get('list')
  @UseGuards(AuthGuard('jwt'))
  async getAllRoles(): Promise<any> {
    const result = await this.rolesService.findAll()
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 新增角色
  @Post('add')
  async addRole(@Body() dto: Roles): Promise<any> {
    const result = await this.rolesService.create(dto)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 删除用户信息
  @Delete('delete/:id')
  async deleteRole(@Param('id') id: number): Promise<any> {
    const role = await this.rolesService.findOne(id)
    if (role?.code === 'admin') {
      return {
        code: 1,
        msg: '超级管理员角色不能删除',
        data: null
      }
    }
    await this.rolesService.remove(id)
    return {
      code: 0,
      msg: 'success',
      data: null
    }
  }
  // 更新用户信息
  @Patch('edit/:id')
  async updateRole(@Param('id') id: number, @Body() dto: Roles): Promise<any> {
    const role = await this.rolesService.findOne(id)
    if (role?.code === 'admin') {
      return {
        code: 1,
        msg: '超级管理员角色不能编辑',
        data: null
      }
    }
    await this.rolesService.update(id, dto)
    return {
      code: 0,
      msg: 'success',
      data: null
    }
  }
}
