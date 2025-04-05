import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class OtpCleanerService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup() {
    const now = new Date()

    const result = await this.prisma.otpCode.deleteMany({
      where: {
        expiresAt: { lt: now }
      }
    })

    if (result.count > 0) {
      console.log(`🧹 Удалено ${result.count} просроченных OTP-кодов`)
    }
  }
}
