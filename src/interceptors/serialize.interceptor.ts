import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { map, Observable } from 'rxjs'

@Injectable()
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
