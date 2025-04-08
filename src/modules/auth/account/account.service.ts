import { Injectable } from '@nestjs/common'

import { JwtService } from '@/src/core/jwt/jwt.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'

import { SendCodeInput, VerifyCodeInput } from '../../otp/inputs/otp-code.input'
import { OtpSendCodeModel } from '../../otp/models/otp.model'
import { OtpService } from '../../otp/otp.service'

import { AuthPayload } from './models/user.model'

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService
  ) {}

  public async sendCode(input: SendCodeInput): Promise<OtpSendCodeModel> {
    return this.otpService.sendCode(input)
  }

  public async verifyCode(input: VerifyCodeInput): Promise<AuthPayload> {
    await this.otpService.verifyCode(input)

    let user = await this.prisma.user.findUnique({
      where: { phone: input.phone }
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: input.phone,
          email: 'test@gmail.com',
          name: 'Test User',
          avatarUrl:
            'https://i.pinimg.com/736x/46/bd/4a/46bd4ab0b7c25b8fca7038266e64e954.jpg'
        }
      })
    }

    const tokens = await this.jwtService.issueTokens(user)

    return {
      user,
      ...tokens
    }
  }
}
