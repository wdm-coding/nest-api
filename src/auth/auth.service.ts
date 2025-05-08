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
  // 注册用户信息
  async signUp(username: string, password: string) {
    if (!username || !password) throw new HttpException('用户名或密码不能为空', 400)
    const user = await this.userService.findOneByName(username)
    if (user) throw new ForbiddenException('用户已存在,请直接登录')
    // 密码加密
    const hashPassword = await argon2.hash(password)
    const userTmp = await this.userService.registerUser({ username, password: hashPassword })
    return userTmp
  }
}
