import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { AllExceptionsFilter } from './filters/all-exception.filter'
import { ValidationPipe } from '@nestjs/common'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 使用全局日志记录器
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  // 使用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(WINSTON_MODULE_NEST_PROVIDER)))
  // 设置全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true // 移除多余属性
    })
  )
  // 设置全局路由前缀
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
