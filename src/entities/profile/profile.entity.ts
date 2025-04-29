import { Users } from '../users/users.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number // 主键id字段
  @Column({ type: 'int' })
  gender: number // 性别字段
  @Column({ type: 'varchar', length: 11 })
  phone: string // 手机号字段
  @Column({ type: 'varchar', length: 255 })
  address: string // 地址字段
  // 一对一创建关联关系
  @OneToOne(() => Users, { onDelete: 'CASCADE' }) // 关联到User实体类
  @JoinColumn({ name: 'user_id' }) // 关联字段名
  user: Users // 用户字段
}
