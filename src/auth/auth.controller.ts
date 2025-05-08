import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninUserDto } from './dto/signin-user.dto'
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin') // 登录
  async signIn(@Body() dto: SigninUserDto) {
    const { username, password } = dto
    const token = await this.authService.signIn(username, password)
    return {
      code: 0,
      message: '登录成功',
      data: token
    }
  }
  @Post('signup') // 注册
  async signUp(@Body() dto: SigninUserDto) {
    const { username, password } = dto
    const result = await this.authService.signUp(username, password)
    if (result) {
      return {
        code: 0,
        message: '注册成功',
        data: null
      }
    } else {
      return {
        code: 1,
        message: '注册失败',
        data: null
      }
    }
  }
}
