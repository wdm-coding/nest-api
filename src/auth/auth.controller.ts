import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin') // 登录
  signIn(@Body() dto: any) {
    const { username, password } = dto
    return this.authService.signIn(username, password)
  }

  @Post('signup') // 注册
  signUp(@Body() dto: any) {
    const { username, password } = dto
    return this.authService.signUp(username, password)
  }
}
