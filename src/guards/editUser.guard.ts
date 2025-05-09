import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Users } from '../entities/users/users.entity'

@Injectable()
export class EditUserGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest()
    const targetId = req.params.id
    // 2. 获取请求头中的token, 解析token, 获取其中的用户信息, 判断用户是否为拥有角色权限
    const user = (await this.userService.findOneByName(req.user.username)) as Users
    const isAdmin = user.roles.some(role => role.code === 'admin')
    if (isAdmin) {
      return true
    }
    if (targetId && user.id === Number(targetId)) {
      return true
    }
    throw new ForbiddenException('只允许管理员或本人操作')
  }
}
