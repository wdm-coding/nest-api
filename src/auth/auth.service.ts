import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  // 注册用户信息
  async signUp(userDto: { username: string; password: string }) {
    const user = await this.userService.findOneByName(userDto.username)
    if (user) throw new HttpException('用户已存在,请直接登录', 200)
    // 密码加密处理
    const hashPassword = await argon2.hash(userDto.password)
    const userTmp = await this.userService.registerUser({
      username: userDto.username,
      password: hashPassword
    })
    return userTmp
  }
  // 登录用户信息
  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByName(username)
    if (!user) throw new ForbiddenException('用户名不存在')
    // 用户密码校验
    const isPasswordValid = await argon2.verify(user.password, password)
    if (!isPasswordValid) throw new UnauthorizedException('用户名或密码错误')
    // 生成JWT
    const result = await this.jwtService.signAsync({
      username,
      sub: user.id
    })
    return result
  }
}
