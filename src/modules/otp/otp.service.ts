import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException
} from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { randomInt } from 'crypto'
import { addMinutes, differenceInSeconds, subMinutes } from 'date-fns'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { TwilioService } from '@/src/core/twilio/twilio.service'

import { SendCodeInput, VerifyCodeInput } from './inputs/otp-code.input'
import { OtpSendCodeModel } from './models/otp.model'

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly twilio: TwilioService
  ) {}

  // 🧹 Очистка просроченных кодов
  @Cron('0 3 * * *', { timeZone: 'Asia/Bishkek' })
  async handleCleanup() {
    await this.cleanupExpiredCodes()
  }

  private async cleanupExpiredCodes(): Promise<void> {
    const now = new Date()

    const result = await this.prisma.otpCode.deleteMany({
      where: { expiresAt: { lt: now } }
    })

    if (result.count > 0) {
      this.logger.log(`🧹 Удалено ${result.count} просроченных OTP-кодов`)
    }
  }

  // 📲 Отправка кода
  public async sendCode(input: SendCodeInput): Promise<OtpSendCodeModel> {
    const { phone } = input
    const code = randomInt(100000, 999999).toString()
    const expiresAt = addMinutes(new Date(), 3)
    const nextTryInSeconds = 60

    const recentCode = await this.prisma.otpCode.findFirst({
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

    await this.prisma.otpCode.create({
      data: { phone, code, expiresAt }
    })

    try {
      await this.twilio.sendSms(phone, `Ваш код: ${code}`)
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

  // ✅ Проверка кода
  public async verifyCode(input: VerifyCodeInput): Promise<void> {
    const { code, phone } = input

    const otpRecord = await this.prisma.otpCode.findFirst({
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

    await this.prisma.otpCode.delete({ where: { id: otpRecord.id } })
  }
}
