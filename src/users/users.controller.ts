import { Controller, Get, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { ApiErrorResponse } from '@/libs/common/decorators/api-error.decorator'
import { ApiBaseResponse } from '@/libs/common/decorators/api-response.decorator'

import { GetMeResponseDto } from './dto/get-me-response.dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBaseResponse(GetMeResponseDto, 'Данные авторизованного пользователя')
  @ApiErrorResponse('Пользователь не авторизован', 401)
  async getMe(@Req() req: Request) {
    return this.usersService.getMe(req)
  }
}
