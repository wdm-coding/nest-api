import { Controller, Delete, Get, Patch, Post, NotFoundException, Inject, LoggerService } from '@nestjs/common'
import { UserService } from './user.service'
import { Users } from '../entities/users/users.entity'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  // api 测试
  @Get('test')
  testApi(): any {
    return {
      code: 0,
      msg: 'success',
      data: 'hello nestjs'
    }
  }
  // 查询所有用户
  @Get('list')
  getUsers(): any {
    return this.userService.findAll()
  }
  // 添加用户
  @Post('add')
  addUser(): any {
    const user = { username: 'toimc', password: '123456' } as Users
    return this.userService.create(user)
  }
  // 更新用户信息
  @Patch('update/:id')
  updateUser(): any {
    const user = { username: 'newname' } as Users
    return this.userService.update(1, user)
  }
  // 删除用户信息
  @Delete('delete/:id')
  deleteUser(): any {
    return this.userService.remove(1)
  }
  // 查询用户详情信息
  @Get('profile/:id')
  async getProfile(): Promise<any> {
    this.logger.log('log-日志测试')
    const admin = false
    if (!admin) {
      // nestjs nestjs内置的HttpException类。
      throw new NotFoundException('非管理员用户')
    }
    const data = await this.userService.findProfile(1)
    return {
      code: 0,
      msg: 'success',
      data
    }
  }
  // 查询用户日志信息
  @Get('logs/:id')
  async getUserLogs(): Promise<any> {
    const data = await this.userService.findUserLogs(1)
    return {
      code: 0,
      msg: 'success',
      data
    }
  }
  // 日志高级查询
  @Get('logsByGroup/:id')
  async getLogsByGroup(): Promise<any> {
    const data = await this.userService.findLogsByGroup(1)
    return {
      code: 0,
      msg: 'success',
      data: data.map(item => ({
        user_id: item.user_id,
        result: item.result,
        count: item.count
      }))
    }
  }
}
