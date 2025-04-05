import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { randomInt } from 'crypto'
import { addMinutes, subMinutes } from 'date-fns'

import { BaseResponse } from '@/libs/common/types/base-response'
import { PrismaService } from '@/prisma/prisma.service'
import { TwilioService } from '@/twilio/twilio.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private twilio: TwilioService
  ) {}

  public async sendCode(phone: string) {
    const code = randomInt(100000, 999999).toString()
    const expiresAt = addMinutes(new Date(), 3)

    const recentCode = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        createdAt: {
          gte: subMinutes(new Date(), 1)
        }
      }
    })

    if (recentCode) {
      throw new BadRequestException({
        success: false,
        message: 'Код уже был отправлен недавно. Повторите позже.'
      })
    }

    await this.prisma.otpCode.create({
      data: { phone, code, expiresAt }
    })

    await this.twilio.sendSms(phone, `Ваш код: ${code}`)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Отправка SMS на ${phone}: код ${code}, время жизни ${expiresAt}`
      )
    }

    return {
      success: true,
      message: 'Код успешно отправлен'
    }
  }

  public async verifyCode(phone: string, code: string) {
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!otpRecord) {
      throw new UnauthorizedException({
        success: false,
        message: 'Неверный код. Попробуйте ещё раз.'
      })
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException({
        success: false,
        message: 'Срок действия кода истёк. Запросите новый.'
      })
    }

    await this.prisma.otpCode.delete({ where: { id: otpRecord.id } })

    // TODO: авторизация или создание пользователя

    return {
      success: true,
      message: 'Код подтвержден',
      data: {
        userId: 1,
        jwt: 'eyJhbGciOi...'
      }
    } satisfies BaseResponse<{ userId: number; jwt: string }>
  }
}
