import { IsNotEmpty, IsString, Length } from 'class-validator'

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, {
    // $value: 'admin', // 当前传入的值
    // $property: 'username', // 属性名
    // $target: SigninUserDto, // 类本身
    // $constraint1: 6, // 最小的长度
    // $constraint2: 20, // 最大的长度
    message: '用户名长度必须在$constraint1到$constraint2之间'
  })
  username: string

  @IsString()
  @IsNotEmpty()
  @Length(4, 20, {
    message: '密码长度必须在$constraint1到$constraint2之间'
  })
  password: string
}
