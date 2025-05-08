import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseFilters,
  Patch,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { Users } from '../entities/users/users.entity'
import { UserQuery } from '../types/query.d'
import { TypeormFilter } from '../filters/typeorm.filter'
import { CreatUserPipe } from './pipes/creat-user.pipe'
import { CreateUserDto } from './dto/create-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '../guards/admin.guard'
import { JwtGuard } from '../guards/jwt.guard'

@Controller('user')
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  // 查询所有用户
  @Get('list')
  // 1. 装饰器的执行顺序是从下到上
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  // 2. 传递多个守卫，执行顺序是从前往后
  @UseGuards(AdminGuard)
  async getAllUsers(@Query() query: UserQuery): Promise<any> {
    const result = await this.userService.findAll(query)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 根据id查询用户
  @Get('getUserById/:id')
  getUserById(@Query('id', ParseIntPipe) id: any): Promise<any> {
    return this.userService.findOne(id)
  }
  // 添加用户
  @Post('add')
  async addUser(@Body(CreatUserPipe) dto: CreateUserDto): Promise<any> {
    console.log('dto', dto)
    const result = await this.userService.create(dto)
    return {
      code: 0,
      msg: 'success',
      data: result
    }
  }
  // 更新用户信息
  @Patch('edit/:id')
  async updateUser(@Param('id') id: number, @Body() dto: Users): Promise<any> {
    const res = await this.userService.update(id, dto)
    console.log('res', res)
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
