import { ApiProperty } from '@nestjs/swagger'

export class BaseResponseDto {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 'Операция выполнена успешно' })
  message: string
}
