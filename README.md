# 从0开始搭建nest项目初始化框架

## 1. 全局安装nest-cli工具包 npm i -g @nestjs/cli

## 2. 创建项目 nest new nest-project

## 3. 进入项目目录下载依赖包 npm install (node版本需要20.1.0以上版本)

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

## 12. API开发

### 分页条件查询，查询条件为空时不查询，不为空时查询。需要动态构建查询条件对象
1. 在`utils/db.helper.ts`文件中创建查询工具类
```ts
// 1. unils文件中封装动态条件对象构建函数db.helper.ts
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
export const conditionUtils = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  record: Record<string, unknown>
) => {
  Object.keys(record).forEach(key => {
    if (record[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: record[key] })
    }
  })
  return queryBuilder
}
```
2. 调用封装好的函数
```ts
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
```

### 创建typeorm的异常过滤器
1. 在filters目录下创建typeorm.filter.ts文件
```bash
$ nest g f filters/typeorm --flat --no-spec
```
2. 编写typeorm异常过滤器
```ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { QueryFailedError, TypeORMError } from 'typeorm'
@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    let msg = exception.message
    if (exception instanceof QueryFailedError) {
      const errno = exception.driverError?.errno || null
      switch (errno) {
        case 1062: // 唯一约束冲突
          msg = `字段重复，请检查数据是否已存在`
          break
        default:
          msg = exception.message || '数据库查询异常'
          break
      }
    }
    response.status(500).json({
      code: -1,
      msg,
      data: null
    })
  }
}
```

## 14. 管道
### nestjs内置全局管道注册

```ts
import { ValidationPipe } from '@nestjs/common'
app.useGlobalPipes(new ValidationPipe())
```

### 创建管道
1. 安装class-validator和class-transformer
+ class-validator 用于验证数据，class-transformer 用于转换数据。

```bash
$ npm install class-validator class-transformer --save
```

2. 使用`class-validator`创建校验规则,在`src/user/dto`目录下创建`user-dto.ts`文件
```ts
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator'
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value: 'admin', // 当前传入的值
    // $property: 'username', // 属性名
    // $target: SigninUserDto, // 类本身
    // $constraint1: 6, // 最小的长度
    // $constraint2: 20, // 最大的长度
    message: '用户名长度必须在6到20之间'
  })
  username: string
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: '密码长度必须在6到20之间'
  })
  password: string
  @IsNumber()
  gender: number
  @IsString()
  phone: string
  @IsString()
  address: string
  @IsString()
  roleIds: string
}
```
3. 在`src/user/pipes`目录下创建`userPipe.ts`文件实现自定义管道
```ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
@Injectable()
export class CreatUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    // 这里可以对value进行校验，校验不通过抛出异常
    return value
  }
}
```

4. 在`src/user/user.controller.ts`中使用自定义管道和DTO

```ts
// 添加用户
@Post('add')
async addUser(@Body(CreatUserPipe) dto: CreateUserDto): Promise<any> {
  console.log('dto', dto)
  const result = await this.userService.create(dto)
  return {
    code: 0,
    msg: 'success',
    data: result
  }
}
```
5. 在`src/user/user.controller.ts`中使用单个变量校验
+ ParseIntPipe 用于将字符串转换为数字，如果转换失败会抛出异常。
```ts
// 根据id查询用户
@Get('getUserById/:id')
getUserById(@Query('id', ParseIntPipe) id: any): Promise<any> {
  return this.userService.findOne(id)
}
```

## 15. JWT认证

### 安装依赖
+ @nestjs/jwt 模块提供了JWT认证的支持。
+ @nestjs/passport 模块提供了Passport的支持，用于实现OAuth2.0、JWT等认证方式。
+ passport 是一个Node.js中间件，用于实现身份验证。
+ passport-jwt 是一个Passport的JWT策略，用于实现JWT认证。
```bash
$ npm install @nestjs/jwt @nestjs/passport passport passport-jwt --save
```

### 创建Auth模块

1. 生成Auth模块
```bash
$ nest g module auth --no-spec
$ nest g controller auth --no-spec
$ nest g service auth --no-spec
```
2. 创建`auth/auth.strategy.ts`策略文件
```ts
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvConfig } from '../enum/env.enum'
@Injectable()
// 扩展passport-jwt的策略类，用于验证token是否有效
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取token
      ignoreExpiration: false, // 忽略过期时间
      secretOrKey: configService.get(EnvConfig.JWT_SECRET) // 密钥
    })
  }
  validate(payload: any) {
    // 这里可以添加一些验证逻辑，比如检查用户是否存在等
    return payload
  }
}
```

3. 在`auth.module.ts`中导入`JwtModule、PassportModule、JwtStrategy`
```ts
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EnvConfig } from '../enum/env.enum'
import { JwtStrategy } from './auth.strategy'
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(EnvConfig.JWT_SECRET), // 密钥
          signOptions: {
            expiresIn: '1d' // 过期时间 1天
          }
        }
      },
      inject: [ConfigService] // 注入配置服务
    })
  ],
  providers: [AuthService, JwtStrategy], // 注入策略服务
  controllers: [AuthController]
})
export class AuthModule {}
```

4. 在`auth.service.ts`中实现登录接口，通过@nestjs/jwt的jwtService生成token
```ts
import { JwtService } from '@nestjs/jwt'
constructor(
  private readonly userService: UserService,
  private readonly jwtService: JwtService
) {}
// 登录用户信息
async signIn(username: string, password: string) {
  const user = await this.userService.findOneByName(username)
  if (!user) throw new ForbiddenException('用户名不存在')
  // 用户密码校验
  const isPasswordValid = await argon2.verify(user.password, password)
  if (!isPasswordValid) throw new UnauthorizedException('用户名或密码错误')
  // 生成JWT
  const result = await this.jwtService.signAsync({
    username,
    sub: user.id
  })
  return result
}
```

5. 在`auth.controller.ts`中实现登录接口
```ts
constructor(private authService: AuthService) {}
@Post('signin') // 登录
async signIn(@Body() dto: SigninUserDto) {
  const { username, password } = dto
  const token = await this.authService.signIn(username, password)
  return {
    code: 0,
    message: '登录成功',
    data: token
  }
}
```

6. 在`src/guards/jwt.guard.ts`中实现JWT守卫
```ts
import { AuthGuard } from '@nestjs/passport'
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super()
  }
}
```
7. 在`src/guards/admin.guard.ts`中实现admin角色权限守卫
```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Users } from '../entities/users/users.entity'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest()
    // 2. 获取请求头中的token, 解析token, 获取其中的用户信息, 判断用户是否为拥有角色权限
    const user = (await this.userService.findOneByName(req.headers['username'])) as Users
    if (user.roles.find(role => role.code === 'admin')) {
      // 如果用户是管理员，则返回true，否则返回false。
      return true
    } else {
      return false
    }
  }
}
```
8. 在任意模块中`module.ts`全局使用JWT守卫
```ts
import { APP_GUARD } from '@nestjs/core'
import { JwtGuard } from './guards/jwt.guard'
@Module({
  imports: [],
  controllers: []
  providers: [{
    provide: APP_GUARD,
    useClass: JwtGuard,
  }], // 注入全局守卫
  exports: []
})
```
9. 在局部接口中使用守卫
```ts
// 在控制器顶部使用jwt守卫
@UseGuards(AdminGuard) // 使用管理员权限守卫
// 在需要角色权限的接口上使用admin守卫
@Get('list')
@UseGuards(AdminGuard)
async getAllUsers(@Query() query: UserQuery): Promise<any> {
  const result = await this.userService.findAll(query)
  return {
    code: 0,
    msg: 'success',
    data: result
  }
}
```

## argon2密码加密
1. 安装argon2库
```bash
npm install argon2
```
2. 创建账号时使用argon2加密密码
```ts
import * as argon2 from 'argon2'
const hashPassword = await argon2.hash(password)
```
3. 登录时使用argon2验证密码
```ts
const isPasswordValid = await argon2.verify(user.password, password)
```

## 拦截器

1. 创建拦截器`src/interceptors/serialize.interceptor.ts`
```ts
$ nest g interceptor interceptors/serialize --no-spec
```
2. 在拦截器中实现序列化逻辑
```ts
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    console.log('拦截器执行之前')
    return next.handle().pipe(
      map(data => {
        console.log('拦截器执行之后')
        const result = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true // 排除掉多余的值,必须设置Exporse或者Exclude
        })
        return result
      })
    )
  }
}
```
3. 将拦截器封装为一个装饰器`src/decotator/serialize.decorator.ts`
```ts
import { UseInterceptors } from '@nestjs/common'
import { SerializeInterceptor } from '../interceptors/serialize.interceptor'
interface ClassConstructor {
  new (...args: any[]): any
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}
```
4. 在控制器中使用拦截器装饰器`src/user/user.controller.ts`
```ts
@Serialize(UserDto)
async getAllUsers(@Query() query: UserQuery): Promise<any> {
  const result = await this.userService.findAll(query)
  return {
    code: 0,
    msg: 'success',
    data: result
  }
}
```










## 启动项目 
1. docker-compose up -d
2. npm run start:dev