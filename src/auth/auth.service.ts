import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signIn(username: string, password: string) {
    const result = await this.userService.findOneByName(username)
    return { username, password, result }
  }
  signUp(username: string, password: string) {
    return { username, password }
  }
}
