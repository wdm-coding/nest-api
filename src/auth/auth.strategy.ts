import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from '../enum/env.enum'
@Injectable()
// 扩展passport-jwt的策略类，用于验证token是否有效
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取token
      ignoreExpiration: false, // 忽略过期时间
      secretOrKey: configService.get(EnvConfig.JWT_SECRET) // 密钥
    })
  }
  validate(payload: any) {
    // 这里可以添加一些验证逻辑，比如检查用户是否存在等
    return payload
  }
}
