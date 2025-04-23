import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { EnvConfig } from 'src/enum/env.enum'
// 1. 通过环境变量读取不同的.env文件
function getEnv(env: string): Record<string, unknown> {
  // 检查环境变量文件是否存在
  if (fs.existsSync(env)) {
    // 如果文件存在，则读取文件内容并解析
    return dotenv.parse(fs.readFileSync(env))
  }
  // 如果文件不存在，返回一个空对象
  return {}
}

// 2. 批量导入entities实体文件
const entitiesDir = [__dirname + '/src/entities/**/*.entity{.ts,.js}']

// 3. 通过dotENV来解析不同的配置文件
function buildConnectionOptions() {
  const defaultConfig = getEnv(`.env`) // 从默认环境配置文件读取配置
  const envConfig = getEnv(`.env.${process.env.NODE_ENV}`) // 根据当前环境变量读取相应的环境配置文件
  const config = { ...defaultConfig, ...envConfig } // 合并默认配置和环境配置
  return {
    type: config[EnvConfig.DB_TYPE], // 数据库类型
    host: config[EnvConfig.DB_HOST], // 数据库主机
    port: config[EnvConfig.DB_PORT], // 数据库端口
    username: config[EnvConfig.DB_USERNAME], // 数据库用户名
    password: config[EnvConfig.DB_PASSWORD], // 数据库密码
    database: config[EnvConfig.DB_DATABASE], // 数据库名称
    entities: entitiesDir, // 数据库实体
    synchronize: true, // 是否自动同步数据库架构
    logging: false // 是否记录日志
  } as TypeOrmModuleOptions
}

// 3. 导出配置文件
export const typeOrmConfig = buildConnectionOptions()
// 4. 导出数据源配置文件
export default new DataSource({
  ...typeOrmConfig,
  migrations: ['src/migrations/**'], // 迁移文件路径
  subscribers: [] // 订阅者文件路径
} as DataSourceOptions)
