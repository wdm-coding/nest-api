import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Users } from '../entities/users/users.entity'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest()
    // 2. 获取请求头中的token, 解析token, 获取其中的用户信息, 判断用户是否为拥有角色权限
    const user = (await this.userService.findOneByName(req.headers['username'])) as Users
    if (user.roles.find(role => role.code === 'admin')) {
      // 如果用户是管理员，则返回true，否则返回false。
      return true
    } else {
      return false
    }
  }
}
