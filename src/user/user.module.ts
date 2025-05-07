import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from '../entities/users/users.entity'
import { Roles } from '../entities/roles/roles.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
