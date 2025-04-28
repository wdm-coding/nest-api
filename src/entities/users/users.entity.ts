import { Logs } from '../logs/logs.entity'
import { Profile } from '../profile/profile.entity'
import { Roles } from '../roles/roles.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  AfterInsert,
  AfterRemove
} from 'typeorm'
@Entity() // 实体类装饰器，告诉 TypeORM 这个类是一个实体类。
export class Users {
  @PrimaryGeneratedColumn() // 主键字段装饰器，告诉 TypeORM 这个属性是主键。
  id: number
  @Column({ type: 'varchar', length: 255, unique: true }) // 字段装饰器，告诉 TypeORM 这个属性是一个数据库列。
  username: string
  @Column({ type: 'varchar', length: 255 }) // 字段装饰器，告诉 TypeORM 这个属性是一个数据库列。
  password: string
  @OneToMany(() => Logs, logs => logs.users) // 关系装饰器，告诉 TypeORM 这个属性是一对多关系。
  logs: Logs[]
  @ManyToMany(() => Roles, roles => roles.users) // 关系装饰器，告诉 TypeORM 这个属性是多对多关系。
  @JoinTable({
    name: 'users-roles', // 关联表的名字。
    joinColumn: {
      // 关联表的外键字段。
      name: 'users_id', // 外键字段的名字。
      referencedColumnName: 'id' // 外键字段引用的列名。
    },
    inverseJoinColumn: {
      // 关联表的另一个外键字段。
      name: 'roles_id', // 另一个外键字段的名字。
      referencedColumnName: 'id' // 另一个外键字段引用的列名。
    },
    schema: 'nest-test-db'
  }) // 关联表装饰器，告诉 TypeORM 这个属性是多对多关系并且需要创建一个关联表。
  roles: Roles[]
  @OneToOne(() => Profile, profile => profile.user, { cascade: true }) // cascade: true 表示级联。
  profile: Profile
  // 钩子函数 装饰器，告诉 TypeORM 这个函数是一个钩子函数。
  @AfterInsert() // 数据插入后的钩子函数。
  afterInsert() {
    // 执行一些操作。
    console.log('afterInsert')
  }

  @AfterRemove() // 数据删除后的钩子函数。
  afterRemove() {
    // 执行一些操作。
    console.log('afterRemove')
  }
}
