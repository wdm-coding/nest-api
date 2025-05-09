import {
  Controller,
  Delete,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  ParseIntPipe,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserQuery } from '../types/query.d'
import { TypeormDecorator } from '../decotator/typeorm.decotator'
import { CreatUserPipe } from './pipes/user.pipe'
import { CreateUserDto, updateUserDto } from './dto/user.dto'
import { AdminGuard } from '../guards/admin.guard'
import { JwtGuard } from '../guards/jwt.guard'
import { SerializeInterceptor } from '../interceptors/serialize.interceptor'
import { ResponseInterceptor } from '../interceptors/response.interceptor'
import { EditUserGuard } from '../guards/editUser.guard'

@Controller('user')
@TypeormDecorator()
@UseGuards(JwtGuard)
@UseInterceptors(new ResponseInterceptor())
export class UserController {
  constructor(private userService: UserService) {}
  // 查询所有用户
  @Get('list')
  async getAllUsers(@Query() query: UserQuery): Promise<any> {
    const result = await this.userService.findAll(query)
    return result
  }
  // 根据id查询用户
  @Get('getUserById/:id')
  getUserById(@Query('id', ParseIntPipe) id: any): Promise<any> {
    return this.userService.findOne(id)
  }
  // 添加用户
  @Post('add')
  @UseGuards(AdminGuard)
  @UseInterceptors(new SerializeInterceptor(CreateUserDto))
  async addUser(@Body(CreatUserPipe) dto: CreateUserDto): Promise<any> {
    const result = await this.userService.create(dto)
    return result
  }
  // 更新用户信息
  @Patch('edit/:id')
  @UseGuards(EditUserGuard)
  @UseInterceptors(new SerializeInterceptor(updateUserDto))
  async updateUser(@Param('id') id: number, @Body() dto: updateUserDto): Promise<any> {
    const result = await this.userService.update(id, dto)
    return result
  }
  // 删除用户信息
  @Delete('delete/:id')
  @UseGuards(EditUserGuard)
  async deleteUser(@Param('id') id: number): Promise<any> {
    await this.userService.remove(id)
    return { id }
  }
  // 查询用户详情信息
  @Get('profile/:id')
  async getProfile(@Param('id') id: number): Promise<any> {
    const data = await this.userService.findProfile(id)
    return data
  }
}
