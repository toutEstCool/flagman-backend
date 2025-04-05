import { ApiProperty } from '@nestjs/swagger'
import { AuthType, UserRole, UserStatus } from '@prisma/__generated__'

export class UserDto {
  @ApiProperty({ example: 'a34f4b5f-1244-4f09-88bc-1b2f4d6d74d0' })
  id: string

  @ApiProperty({ example: '+996503051023', required: false })
  phone?: string

  @ApiProperty({ example: 'user@example.com', required: false })
  email?: string

  @ApiProperty({ example: 'Иван Иванов', required: false })
  name?: string

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatarUrl?: string

  @ApiProperty({ example: 'Бишкек', required: false })
  city?: string

  @ApiProperty({ example: true })
  isVerified: boolean

  @ApiProperty({ example: false })
  isTwoFactorEnabled: boolean

  @ApiProperty({ example: 'user', enum: UserRole })
  role: UserRole

  @ApiProperty({ example: 'active', enum: UserStatus })
  status: UserStatus

  @ApiProperty({ example: 'phone', enum: AuthType })
  authType: AuthType

  @ApiProperty({ example: '2025-04-05T15:36:00.000Z', required: false })
  lastLogin?: Date

  @ApiProperty({ example: '2025-04-05T15:30:00.000Z' })
  createdAt: Date
}
