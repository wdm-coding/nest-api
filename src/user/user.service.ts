import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from '../entities/users/users.entity'
import { UserQuery } from '../types/query.d'
import { conditionUtils } from '../utils/db.helper'
@Injectable() // NestJS装饰器，用于将类标记为服务。
export class UserService {
  constructor(
    @InjectRepository(Users) // 注入Repository<Users>类型，
    private readonly userRepository: Repository<Users> // 并将其赋值给userRepository属性。
  ) {}
  // 查询所有用户信息
  async findAll(query: UserQuery) {
    const { username, roleId, gender, pageNum, pageSize } = query
    // 分页参数，默认为第一页每页10条数据
    const take = Number(pageSize) || 10 // 每页显示多少条数据
    const skip = (Number(pageNum || 1) - 1) * take // 跳过多少条数据
    // 1. 关联查询
    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.profile', 'profile')
      .leftJoinAndSelect('users.roles', 'roles')
      // 2. 动态查询条件，如果条件为空则不添加该条件。(第一个查询条件为1=1，后续的条件为AND条件)
      .where(username ? 'users.username LIKE :username' : '1=1', username ? { username: `%${username}%` } : {})
    const searchList = {
      'roles.id': roleId,
      'profile.gender': gender
    }
    const list = conditionUtils<Users>(queryBuilder, searchList)
    const total = await list.getCount() // 总条数
    const result = await list.skip(skip).take(take).getMany()
    // getRawMany()不直接支持分页，因为它只是执行原始SQL查询。
    return {
      pageSize: take, // 每页显示多少条数据
      pageNum: Number(pageNum || 1), // 当前页码
      total, // 总条数
      list: result.map(item => ({
        userId: item.id,
        password: '',
        address: item.profile?.address,
        gender: item.profile?.gender,
        phone: item.profile?.phone,
        username: item.username,
        roleName: item.roles.map(role => role.name).join(','),
        roleIds: item.roles.map(role => role.id).join(',')
      }))
    }
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
