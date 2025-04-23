import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Users } from '../entities/users/users.entity'
import { Logs } from 'src/entities/logs/logs.entity'

@Injectable() // NestJS装饰器，用于将类标记为服务。
export class UserService {
  constructor(
    @InjectRepository(Users) // 注入Repository<Users>类型，
    private readonly userRepository: Repository<Users>, // 并将其赋值给userRepository属性。
    @InjectRepository(Logs)
    private readonly logsRepository: Repository<Logs>
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
  // 查询用户日志信息
  async findUserLogs(id: number) {
    const user = await this.findOne(id)
    return this.logsRepository.find({
      relations: {
        users: false
      },
      where: { users: user as Users }
    })
  }
  // 日志高级查询
  async findLogsByGroup(id: number) {
    // 查询logs 的 result 字段分组统计
    return this.logsRepository
      .createQueryBuilder('logs') // 创建查询构建器，指定别名logs
      .select(['logs.result as result', 'COUNT(logs.result) as count']) // 指定查询的字段和别名
      .leftJoinAndSelect('logs.users', 'user') // 左连接users表，并选择相关字段
      .where('user.id = :id', { id: id }) // 添加查询条件，指定用户ID
      .groupBy('logs.result') // 根据logs.result字段分组统计
      .orderBy('count', 'DESC') // 根据统计结果降序排序
      .addOrderBy('result', 'DESC') // 根据日志结果升序排序
      .offset(1) // 设置查询偏移量，用于分页查询-pageNumber
      .limit(3) // 限制查询结果数量为10条 -pageSize
      .getRawMany() // 执行查询并返回原始结果集
  }
}
