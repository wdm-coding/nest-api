import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from '../entities/users/users.entity'
import { UserQuery } from '../types/query.d'
@Injectable() // NestJS装饰器，用于将类标记为服务。
export class UserService {
  constructor(
    @InjectRepository(Users) // 注入Repository<Users>类型，
    private readonly userRepository: Repository<Users> // 并将其赋值给userRepository属性。
  ) {}
  // 查询所有用户信息
  findAll(query: UserQuery) {
    const { username, roleId, gender } = query
    // 1. 关联查询
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.profile', 'profile')
      .leftJoinAndSelect('users.roles', 'roles')
      // 2. 条件查询 条件为空时不查询
      // if (username) queryBuilder.where('users.username LIKE :username', { username: `%${username}%` })
      // if (roleId) queryBuilder.andWhere('roles.id = :roleId', { roleId })
      // if (gender) queryBuilder.andWhere('profile.gender = :gender', { gender })
      // 3. 动态查询条件，如果条件为空则不添加该条件。(第一个查询条件为1=1，后续的条件为AND条件)
      .where(username ? 'users.username LIKE :username' : '1=1', username ? { username: `%${username}%` } : {})
    const searchList = {
      'roles.id = :roleId': roleId,
      'profile.gender = :gender': gender
    }
    Object.keys(searchList).forEach(key => {
      if (searchList[key]) {
        console.log(`${key} = :${searchList[key]}`, { [searchList[key]]: searchList[key] })
        queryBuilder.andWhere(`${key} = :${searchList[key]}`, { [searchList[key]]: searchList[key] })
      }
    })
    // .andWhere('roles.id = :roleId',{ roleId })
    // .andWhere(gender ? 'profile.gender = :gender' : '1=1', gender ? { gender } : {})
    return queryBuilder.getMany()
  }
  // 根据id查询用户信息
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
