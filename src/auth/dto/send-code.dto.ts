import { IsPhoneNumber, IsString, Length } from 'class-validator'

export class SendCodeDto {
  @IsPhoneNumber('KG')
  phone: string
}

export class VerifyCodeDto {
  @IsString()
  @Length(6, 6)
  code: string
}
