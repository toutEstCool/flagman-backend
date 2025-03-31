import { IsPhoneNumber, IsString, Length } from 'class-validator'

export class VerifyCodeDto {
  @IsPhoneNumber('KG')
  phone: string

  @IsString()
  @Length(4, 6)
  code: string
}
