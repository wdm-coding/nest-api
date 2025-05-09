import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()
    if (response.statusCode === 201) {
      response.status(200)
    }
    return next.handle().pipe(map(data => ({ code: 0, data: data, message: '请求成功' })))
  }
}
