import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  password: string
  @IsNumber()
  gender: number
  @IsString()
  phone: string
  @IsString()
  address: string
  @IsString()
  roleIds: string
}
