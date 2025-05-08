import { Global, Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { LogsModule } from './logs/logs.module'
import { RolesModule } from './roles/roles.module'
import { typeOrmConfig } from '../ormconfig'
import { AuthModule } from './auth/auth.module'
import validationSchema from './config/joi.config'
import { APP_GUARD } from '@nestjs/core'
import { AdminGuard } from './guards/admin.guard'
@Global() // 全局注册APP模块
@Module({
  imports: [
    // 环境变量配置模块 读取当前环境的配置信息
    ConfigModule.forRoot({
      isGlobal: true, // 全局配置
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 如果在多个文件中找到某个变量，则第一个变量优先。
      validationSchema
    }),
    // 数据库配置
    TypeOrmModule.forRoot(typeOrmConfig),
    // 日志模块
    LogsModule,
    // 其他模块...
    UserModule,
    RolesModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: AdminGuard // 自定义守卫
    }
  ],
  exports: [Logger]
})
export class AppModule {}
