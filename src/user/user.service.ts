import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from '../entities/users/users.entity'

@Injectable() // NestJS装饰器，用于将类标记为服务。
export class UserService {
  constructor(
    @InjectRepository(Users) // 注入Repository<Users>类型，
    private readonly userRepository: Repository<Users> // 并将其赋值给userRepository属性。
  ) {}
  // 查询所有用户信息
  findAll() {
    return this.userRepository.find()
  }
  // 根据用户名查询用户信息
  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }
  // 创建用户信息
  async create(users: Users) {
    const userTmp = await this.userRepository.create(users)
    return this.userRepository.save(userTmp)
  }
  // 更新用户信息
  async update(id: number, user: Partial<Users>) {
    return this.userRepository.update(id, user)
  }
  // 删除用户信息
  remove(id: number) {
    return this.userRepository.delete(id)
  }
  // 查询用户详情信息
  findProfile(id: number) {
    return this.userRepository.findOne({
      relations: {
        profile: true
      },
      where: { id }
    })
  }
}
