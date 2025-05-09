import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupUserDto, SigninUserDto } from './dto/auth-user.dto'
import { SerializeInterceptor } from '../interceptors/serialize.interceptor'
import { ResponseInterceptor } from '../interceptors/response.interceptor'
@Controller('auth')
@UseInterceptors(new ResponseInterceptor())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup') // 注册
  @UseInterceptors(new SerializeInterceptor(SignupUserDto))
  async signUp(@Body() dto: SignupUserDto) {
    const result = await this.authService.signUp(dto)
    return result
  }
  @Post('signin') // 登录
  async signIn(@Body() dto: SigninUserDto) {
    const { username, password } = dto
    const token = await this.authService.signIn(username, password)
    return token
  }
}
