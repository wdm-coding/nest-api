import { Controller, Delete, Get, Post, Inject, LoggerService, Body, Param, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { Users } from '../entities/users/users.entity'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { UserQuery } from '../types/query.d'

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  // 查询所有用户
  @Get('list')
  async getUsers(@Query() query: UserQuery): Promise<any> {
    console.log('query', query)
    const result = await this.userService.findAll(query)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 根据id查询用户
  @Get('getUserById/:id')
  getUser(): Promise<any> {
    return this.userService.findOne(1)
  }
  // 添加用户
  @Post('add')
  async addUser(@Body() dto: Users): Promise<any> {
    const result = await this.userService.create(dto)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 更新用户信息
  @Put('edit/:id')
  async updateUser(@Param('id') id: number, @Body() dto: Users): Promise<any> {
    await this.userService.update(id, dto)
    return {
      code: 0,
      msg: 'success',
      data: null
    }
  }
  // 删除用户信息
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number): Promise<any> {
    const user = await this.userService.findOne(id)
    if (user?.username === 'admin') {
      return {
        code: 1,
        msg: '超级管理员不能删除',
        data: null
      }
    } else {
      await this.userService.remove(id)
      return {
        code: 0,
        msg: 'success',
        data: null
      }
    }
  }
  // 查询用户详情信息
  @Get('profile/:id')
  async getProfile(): Promise<any> {
    const data = await this.userService.findProfile(1)
    return {
      code: 0,
      msg: 'success',
      data
    }
  }
}
