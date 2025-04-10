import { Injectable } from '@nestjs/common'

import { JwtService } from '@/src/core/jwt/jwt.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { GetUserMetadata } from '@/src/shared/utils/user-metadata.util'

import { SendCodeInput, VerifyCodeInput } from '../../otp/inputs/otp-code.input'
import { OtpSendCodeModel } from '../../otp/models/otp.model'
import { OtpService } from '../../otp/otp.service'

import { AuthPayload } from './models/user.model'

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService
  ) {}

  public async sendCode(input: SendCodeInput): Promise<OtpSendCodeModel> {
    return this.otpService.sendCode(input)
  }

  public async verifyCode(
    input: VerifyCodeInput,
    req: Request,
    userAgent: string
  ): Promise<AuthPayload> {
    const metadata = GetUserMetadata(req, userAgent)
    console.log('[METADATA]', metadata)

    await this.otpService.verifyCode(input)

    let user = await this.prismaService.user.findUnique({
      where: { phone: input.phone }
    })

    if (!user) {
      user = await this.prismaService.user.create({
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

  public async getMe(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id
      }
    })

    return user
  }

  public async logout(userId: string) {
    const result = await this.prismaService.refreshToken.deleteMany({
      where: { userId }
    })

    return { success: result.count > 0 }
  }
}
