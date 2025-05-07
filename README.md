# 从0开始搭建nest项目初始化框架

## 1. 全局安装nest-cli工具包 npm i -g @nestjs/cli

## 2. 创建项目 nest new nest-project

## 3. 进入项目目录下载依赖包 npm install(node版本需要20.1.0以上版本)
   v20.1.0
## 4. 添加.prettierrc配置文件,配置prettier规则

## 5. 添加eslintrc.js或者eslint.config.mjs配置文件,配置prettier规则

## 6. 环境变量配置
:::tip 环境变量配置
1. 创建环境变量枚举文件`src/enum/env.enum.ts`,枚举环境变量配置
2. 安装cross-env控制环境变量 npm i cross-env
3. 在package.json中配置环境变量运行脚本
```json
"scripts": {
  "start:dev": "cross-env NODE_ENV=development nest start --watch",
  "start:prod": "cross-env NODE_ENV=production nest start --watch",
  "build:dev": "cross-env NODE_ENV=development nest build",
  "build:prod": "cross-env NODE_ENV=production nest build",
}
```

4. 安装nestjs-config配置模块作为环境配置方案 npm i --save @nestjs/config
5. 在项目根目录下创建`.env`文件,配置默认环境变量信息
6. 在项目根目录下创建`.env.development`文件,配置开发环境变量信息
7. 在项目根目录下创建`.env.production`文件,配置生产环境变量信息
8. 下载joi依赖包用于环境变量校验`npm i --save joi`
9. 在app.module.ts文件中引入ConfigModule配置模块,并使用ConfigModule.forRoot()方法加载环境变量文件

```ts
ConfigModule.forRoot({
  isGlobal: true, // 全局配置
  envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 如果在多个文件中找到某个变量，则第一个变量优先。
  validationSchema: Joi.object({ // 校验
    NODE_ENV: Joi.string()
      .valid('development', 'production')
      .default('development'),
    PORT: Joi.number().default(3000),
    DB_TYPE: Joi.string().valid('mysql', 'postgres').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required()
  })
})
```
:::

## 7. 配置Docker-compose文件
:::tip Docker-compose文件配置
1. 项目根目录下创建`docker-compose.yml`文件,配置Docker容器信息
2. 在项目根目录下执行命令`docker-compose up -d`,启动服务
:::

## 8. 配置数据库连接
1. 在项目根目录下创建`ormconfig.ts`文件，配置数据库连接信息
```ts
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
```

2. 在`app.module.ts`中配置TypeORM
```ts
import { typeOrmConfig } from '../ormconfig'
@Module({
  imports:[
    TypeOrmModule.forRoot(typeOrmConfig),
  ]
})
```

## 9. 创建数据库实体类
1. 在`src/entities`目录下创建数据库实体类文件，例如：`user.entity.ts`
2. 在`app.module.ts`文件中引入实体类，并注册到TypeOrmModule中entities数组中

## 10. 创建控制器和业务逻辑层
1. 在`src/user`目录下创建控制器文件，例如：`user.controller.ts`
2. 在`src/user`目录下创建业务逻辑层文件，例如：`user.service.ts`
3. 在`src/user`目录下创建模块文件，例如：`user.module.ts`
4. 在`app.module.ts`文件中引入控制器和业务逻辑层，并注册到@Module装饰器的controllers数组中和providers数组中
```ts
import { UserModule } from './user/user.module'
@Module({
  imports: [
    // 环境变量配置模块 读取当前环境的配置信息
    // 数据库模块 读取当前环境的数据库连接信息
    // 业务模块...
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
```

## 11. 第三方日志模块winston配置

### 1. 下载依赖

```bash
$ npm install --save nest-winston winston
```

### 2. winston滚动日志 `winston-daily-rotate-file`

```bash
$ npm install --save winston-daily-rotate-file
```

### 3. 日志`modules`创建

1.  nest cli 创建模块`logs`
```bash
$ nest g module logs
```

2. 在`src/enum/log.enum.ts`文件中配置日志枚举
```ts
export enum LogConfig {
  LOG_LEVEL = 'LOG_LEVEL',
  LOG_ON = 'LOG_ON'
}
```

3. 在.env文件中配置日志变量
```bash
LOG_LEVEL=info
LOG_ON=true
```

4. 在`logs.module.ts`文件中配置日志
```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { utilities, WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { LogConfig } from '../enum/log.enum'
import * as DailyRotateFile from 'winston-daily-rotate-file'
const consoleConfig = () =>
  new winston.transports.Console({
    level: 'info', // 日志等级
    format: winston.format.combine(
      winston.format.timestamp(), // 添加时间戳
      winston.format.json(), // 添加 json 格式
      // 设置 nestLike 格式，此处设置为 NestJs-Log 应用名称
      utilities.format.nestLike('NestJs-Log', {
        colors: true, // 开启彩色输出
        prettyPrint: true, // 开启美化输出
        processId: true, // 开启进程 ID
        appName: true // 开启应用名称
      })
    )
  })
const warnDailyRotateFileConfig = (configService: ConfigService) =>
  new DailyRotateFile({
    level: configService.get(LogConfig.LOG_LEVEL), // 设置日志级别，此处设置为 info 及以上级别的日志才会输出到文件
    dirname: 'logs/winston-log', // 设置日志文件目录，此处设置为 logs 文件夹下的 winston-log 子文件夹
    filename: `${configService.get(LogConfig.LOG_LEVEL)}-%DATE%.log`, // 设置日志文件名，此处设置为当前日期.log
    datePattern: 'YYYY-MM-DD-HH', // 设置日志文件日期格式，此处设置为 YYYY-MM-DD
    zippedArchive: true, // 设置日志文件是否压缩，此处设置为压缩
    maxSize: '20m', // 设置日志文件最大大小，此处设置为 20MB
    maxFiles: '14d', // 设置日志文件最大数量，此处设置为 14 天
    format: winston.format.combine(
      winston.format.timestamp(), // 添加时间戳
      winston.format.simple() // 添加简单格式
    )
  })
const infoDailyRotateFileConfig = () =>
  new DailyRotateFile({
    level: 'info', // 设置日志级别，此处设置为 info 及以上级别的日志才会输出到文件
    dirname: 'logs/winston-log', // 设置日志文件目录，此处设置为 logs 文件夹下的 winston-log 子文件夹
    filename: `info-%DATE%.log`, // 设置日志文件名，此处设置为当前日期.log
    datePattern: 'YYYY-MM-DD-HH', // 设置日志文件日期格式，此处设置为 YYYY-MM-DD
    zippedArchive: true, // 设置日志文件是否压缩，此处设置为压缩
    maxSize: '20m', // 设置日志文件最大大小，此处设置为 20MB
    maxFiles: '14d', // 设置日志文件最大数量，此处设置为 14 天
    format: winston.format.combine(
      winston.format.timestamp(), // 添加时间戳
      winston.format.simple() // 添加简单格式
    )
  })

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // 自定义提供器
        transports: [
          // Console输出
          consoleConfig(),
          // warn文件输出
          warnDailyRotateFileConfig(configService),
          // info文件输出
          infoDailyRotateFileConfig()
        ]
      })
    })
  ]
})
export class LogsModule {}
```

### 4. 全局HTTP异常捕获过滤器

1. 下载获取用户IP地址的库`request-ip`
```bash
$ npm install request-ip --save
```

2. 在`src/filters/all-exception.filter.ts`文件中创建异常过滤器
```ts
// 全局所有异常捕获过滤器
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core' // 导入http适配器宿主服务
import * as requestIp from 'request-ip' // 获取用户IP
@Catch() // 捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost, // http适配器宿主
    private logger: LoggerService
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost // 获取http适配器
    const ctx = host.switchToHttp() // 切换到http上下文
    const response = ctx.getResponse<Response>() // 获取响应对象
    const request = ctx.getRequest<Request>() // 获取请求对象
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR // 获取http状态码
    // 响应体数据
    const responseBody = {
      headers: request.headers, // 请求头
      body: request.body, // 请求体
      timestamp: new Date().toISOString(), // 时间戳
      ip: requestIp.getClientIp(request), // 用户IP
      message: exception.message, // 异常信息
      exception: exception.name, // 异常名称
      status: httpStatus, // 状态码
      error: exception.response || '未知错误' // 错误信息
    }
    this.logger.error('捕获异常: ', responseBody) // 打印日志信息
    httpAdapter.reply(response, responseBody, httpStatus) // 返回响应信息
  }
}
```

### 5. 在`main.ts`中全局注册日志模块与异常过滤器 
```ts
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
// 1. 全局注册日志
app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)) 
// 2. 全局注册异常过滤器
app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, app.get(WINSTON_MODULE_NEST_PROVIDER))) 
```

### 6. 在控制器中使用日志
```ts
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston' 
import { Inject,LoggerService } from '@nestjs/common'
constructor(
  private userService: UserService,
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private logger: LoggerService
) {
  this.logger.log('log-日志测试')
}
```





## 启动项目 
1. docker-compose up -d
2. npm run start:dev