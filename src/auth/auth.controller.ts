import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { SendCodeDto } from './dto/send-code.dto'
import { VerifyCodeDto } from './dto/verify-code.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto.phone)
  }

  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.phone, dto.code)
  }
}
