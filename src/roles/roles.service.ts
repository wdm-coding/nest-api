import { Injectable } from '@nestjs/common'
import { Roles } from '../entities/roles/roles.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) // 注入Repository<Users>类型，
    private readonly roleRepository: Repository<Roles> // 并将其赋值给userRepository属性。
  ) {}
  // 查询列表
  async findAll() {
    const queryBuilder = this.roleRepository.createQueryBuilder('roles')
    return queryBuilder.getMany()
  }
  // 根据id查询角色信息
  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } })
  }
  // 插入数据
  async create(createRoleDto: Roles) {
    const roleTmp = await this.roleRepository.create(createRoleDto)
    return this.roleRepository.save(roleTmp)
  }
  // 删除数据
  async remove(id: number) {
    const role = await this.findOne(id)
    return role && this.roleRepository.remove(role)
  }
  // 更新数据
  async update(id: number, createRoleDto: Roles) {
    const role = await this.findOne(id)
    if (!role) {
      throw new Error('Role not found')
    }
    const newUser = this.roleRepository.merge(role, createRoleDto)
    return this.roleRepository.save(newUser)
  }
}
