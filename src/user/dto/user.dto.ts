import { Expose } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @Expose()
  id: number
  @IsString({
    message: '用户名必须是字符串',
    always: false
  })
  @IsNotEmpty({
    message: '用户名不能为空',
    always: false
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
  @IsNumber(
    {
      allowNaN: false, // 不允许NaN
      allowInfinity: false, // 不允许无穷大
      maxDecimalPlaces: 0 // 最多小数点位数
    },
    {
      message: '性别参数只能是数字',
      always: false
    }
  )
  gender: number
  @IsPhoneNumber('CN', {
    message: '手机号码格式不正确',
    always: false
  })
  phone: string
  @IsString({
    message: '地址必须是字符串',
    always: false
  })
  address: string
  @IsString({
    message: '角色ID必须是字符串',
    always: false
  })
  roleIds: string
}

export class updateUserDto {
  @Expose()
  id: number
  @IsString({
    message: '用户名必须是字符串',
    always: false
  })
  @IsNotEmpty({
    message: '用户名不能为空',
    always: false
  })
  @Length(5, 20, {
    message: '用户名长度必须在$constraint1到$constraint2之间',
    always: false
  })
  username: string
  @IsNumber(
    {
      allowNaN: false, // 不允许NaN
      allowInfinity: false, // 不允许无穷大
      maxDecimalPlaces: 0 // 最多小数点位数
    },
    {
      message: '性别参数只能是数字',
      always: false
    }
  )
  gender: number
  @IsPhoneNumber('CN', {
    message: '手机号码格式不正确',
    always: false
  })
  phone: string
  @IsString({
    message: '地址必须是字符串',
    always: false
  })
  address: string
  @IsString({
    message: '角色ID必须是字符串',
    always: false
  })
  roleIds: string
}
