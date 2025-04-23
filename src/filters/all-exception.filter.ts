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
