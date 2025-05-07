import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByName(username)
    if (user && user.password === password) {
      // 将用户名作为JWT的有效载荷的一部分，并将其命名为"username"。同时，"sub"字段被设置为用户的ID。这两个字段在验证和访问用户信息时非常有用。
      const result = await this.jwtService.signAsync({
        username,
        sub: user.id
      })
      return result
    } else {
      throw new UnauthorizedException('用户名或密码错误')
    }
  }
  signUp(username: string, password: string) {
    return { username, password }
  }
}
