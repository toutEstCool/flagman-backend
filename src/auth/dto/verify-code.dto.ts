import { ApiProperty } from '@nestjs/swagger'
import { IsPhoneNumber, IsString, Length } from 'class-validator'

export class VerifyCodeDto {
  @ApiProperty({
    example: '+996503051023',
    description: 'Номер телефона, на который был отправлен код'
  })
  @IsPhoneNumber('KG')
  phone: string

  @ApiProperty({
    example: '123456',
    description: 'OTP-код из 6 цифр'
  })
  @IsString()
  @Length(6, 6)
  code: string
}

class VerifyCodeData {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  userId: number

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'JWT-токен после успешной авторизации'
  })
  jwt: string
}

export class VerifyCodeResponseDto {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 'Код подтвержден' })
  message: string

  @ApiProperty({ type: VerifyCodeData })
  data: VerifyCodeData
}
