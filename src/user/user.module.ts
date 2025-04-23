import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from '../entities/users/users.entity'
import { Logs } from 'src/entities/logs/logs.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Users, Logs])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
