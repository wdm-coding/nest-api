import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class CreatUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log('value', value)
    return value
  }
}
