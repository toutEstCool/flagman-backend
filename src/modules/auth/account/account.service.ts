import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { randomInt } from 'crypto'
import { addMinutes, differenceInSeconds, subMinutes } from 'date-fns'

import { JwtService } from '@/src/core/jwt/jwt.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { TwilioService } from '@/src/core/twilio/twilio.service'

import { SendCodeInput, VerifyCodeInput } from './inputs/otp-code.input'
import { OtpSendCodeModel } from './models/otp.model'
import { AuthPayload } from './models/user.model'

@Injectable()
export class AccountService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly twilioService: TwilioService,
    private readonly jwtService: JwtService
  ) {}

  public async sendCode(input: SendCodeInput): Promise<OtpSendCodeModel> {
    const { phone } = input
    const code = randomInt(100000, 999999).toString()
    const expiresAt = addMinutes(new Date(), 3)
    const nextTryInSeconds = 60

    const recentCode = await this.prismaService.otpCode.findFirst({
      where: {
        phone,
        createdAt: { gte: subMinutes(new Date(), 1) }
      }
    })

    if (recentCode) {
      const nextTryIn = differenceInSeconds(
        addMinutes(recentCode.createdAt, 1),
        new Date()
      )

      return {
        success: false,
        message: 'Код уже отправлен. Подождите немного.',
        nextTryIn
      }
    }

    await this.prismaService.otpCode.create({
      data: { phone, code, expiresAt }
    })

    try {
      await this.twilioService.sendSms(phone, `Ваш код: ${code}`)
    } catch (error) {
      if (error?.code === 63038 || error?.status === 429) {
        throw new BadRequestException(
          'Лимит отправки SMS исчерпан. Попробуйте позже.'
        )
      }

      console.error('Ошибка Twilio при отправке кода:', error)
      throw new InternalServerErrorException('Не удалось отправить SMS.')
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Отправка SMS на ${phone}: код ${code}, истекает в ${expiresAt}`
      )
    }

    return {
      success: true,
      message: 'Код успешно отправлен',
      expiresAt,
      nextTryIn: nextTryInSeconds
    }
  }

  public async verifyCode(input: VerifyCodeInput): Promise<AuthPayload> {
    const { code, phone } = input

    const otpRecord = await this.prismaService.otpCode.findFirst({
      where: { phone, code },
      orderBy: { createdAt: 'desc' }
    })

    if (!otpRecord) {
      throw new UnauthorizedException('Неверный код. Попробуйте ещё раз.')
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException(
        'Срок действия кода истёк. Запросите новый.'
      )
    }

    await this.prismaService.otpCode.delete({ where: { id: otpRecord.id } })

    let user = await this.prismaService.user.findUnique({ where: { phone } })

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          phone,
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
