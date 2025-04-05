import { ApiProperty } from '@nestjs/swagger'

import { UserDto } from './user.dto'

export class GetMeResponseDto {
  @ApiProperty({ example: true })
  success: boolean

  @ApiProperty({ example: 'Данные пользователя' })
  message: string

  @ApiProperty({ type: UserDto })
  data: UserDto
}
