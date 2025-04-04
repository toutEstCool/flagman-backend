import { BadRequestException, Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'
import { addMinutes } from 'date-fns'

import { TwilioService } from '@/libs/twilio/twilio.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private twilio: TwilioService
  ) {}

  public async sendCode(phone: string) {
    const code = randomInt(100000, 999999).toString()
    const expiresAt = addMinutes(new Date(), 3)

    await this.prisma.otpCode.create({
      data: { phone, code, expiresAt }
    })

    await this.twilio.sendSms(phone, `Ваш код: ${code}`)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Отправка SMS на ${phone}: код ${code}, время жизни ${expiresAt}`
      )
    }

    return { message: 'Код отправлен' }
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
      throw new Error('Неверный код')
    }

    const now = new Date()

    if (otpRecord.expiresAt < now) {
      throw new BadRequestException('Срок действия кода истек')
    }

    return { message: 'Код подтвержден' }
  }
}
