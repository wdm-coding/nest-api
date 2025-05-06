import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SigninUserDto } from './dto/signin-user.dto'
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin') // 登录
  signIn(@Body() dto: SigninUserDto) {
    const { username, password } = dto
    const token = this.authService.signIn(username, password)
    return {
      code: 0,
      message: '登录成功',
      data: token
    }
  }

  @Post('signup') // 注册
  signUp(@Body() dto: any) {
    const { username, password } = dto
    return this.authService.signUp(username, password)
  }
}
