import { ApiProperty } from '@nestjs/swagger'
import { IsPhoneNumber } from 'class-validator'

export class SendCodeDto {
  @ApiProperty({
    example: '+996503051023',
    description: 'Номер телефона в формате E.164 (Киргизия)'
  })
  @IsPhoneNumber('KG')
  phone: string
}

export class SendCodeResponseDto {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 'Код успешно отправлен' })
  message: string
}
