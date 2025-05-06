import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EnvConfig } from '../enum/env.enum'
import { JwtStrategy } from './auth.strategy'
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(EnvConfig.JWT_SECRET), // 密钥
          signOptions: {
            expiresIn: '1d' // 过期时间 1天
          }
        }
      },
      inject: [ConfigService] // 注入配置服务
    })
  ],
  providers: [AuthService, JwtStrategy], // 注入策略服务
  controllers: [AuthController]
})
export class AuthModule {}
