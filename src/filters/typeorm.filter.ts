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
