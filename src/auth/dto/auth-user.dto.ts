import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString, Length } from 'class-validator'
// 注册dto校验
export class SignupUserDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
    always: false // 总是校验，即使前面的校验失败了也继续校验
  })
  @Length(5, 20, {
    message: '用户名长度必须在$constraint1到$constraint2之间',
    always: false
  })
  @Expose()
  username: string

  @IsString()
  @IsNotEmpty({
    message: '密码不能为空',
    always: false
  })
  @Length(5, 20, {
    message: '密码长度必须在$constraint1到$constraint2之间',
    always: false
  })
  password: string
}
// 登录dto校验
export class SigninUserDto {
  @IsString({
    message: '用户名必须是字符串',
    always: false
  })
  @IsNotEmpty({
    message: '用户名不能为空',
    always: false
  })
  username: string

  @IsString({
    message: '密码必须是字符串',
    always: false
  })
  @IsNotEmpty({
    message: '密码不能为空',
    always: false
  })
  password: string
}
