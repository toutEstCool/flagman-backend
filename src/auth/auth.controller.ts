import { Body, Controller, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { ApiErrorResponse } from '@/libs/common/decorators/api-error.decorator'
import { ApiBaseResponse } from '@/libs/common/decorators/api-response.decorator'

import { AuthService } from './auth.service'
import { SendCodeDto, SendCodeResponseDto } from './dto/send-code.dto'
import { VerifyCodeDto, VerifyCodeResponseDto } from './dto/verify-code.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  @ApiBaseResponse(SendCodeResponseDto, 'Код отправлен')
  @ApiErrorResponse('Код уже был отправлен недавно. Повторите позже.')
  async sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto.phone)
  }

  @Post('verify-code')
  @ApiBaseResponse(VerifyCodeResponseDto, 'Код подтвержден')
  @ApiErrorResponse('Срок действия кода истек')
  @ApiErrorResponse('Неверный код', 401)
  async verifyCode(@Body() dto: VerifyCodeDto, @Req() req: Request) {
    return this.authService.verifyCode(dto.phone, dto.code, req)
  }
}
