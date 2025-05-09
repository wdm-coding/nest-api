import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { CreateUserDto } from '../dto/user.dto'

@Injectable()
export class CreatUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    // 这里可以对value进行校验，校验不通过抛出异常
    return value
  }
}
