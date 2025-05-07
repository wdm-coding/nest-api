import { Users } from '../users/users.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number // 角色ID字段
  @Column({ type: 'varchar', length: 255 })
  name: string // 角色名称字段
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string // 角色code
  @Column({ type: 'varchar', length: 255 })
  description: string // 角色描述字段
  @ManyToMany(() => Users, users => users.roles) // 关系装饰器，告诉 TypeORM 这个属性是多对多关系。
  users: Users[] // 用户字段
}
