import { IsPhoneNumber } from 'class-validator'

export class SendCodeDto {
  @IsPhoneNumber('KG')
  phone: string
}
