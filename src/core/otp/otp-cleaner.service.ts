import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class OtpCleanerService {
  private readonly logger = new Logger(OtpCleanerService.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 3 * * *', { timeZone: 'Asia/Bishkek' })
  async handleCleanup() {
    const now = new Date()

    const result = await this.prisma.otpCode.deleteMany({
      where: { expiresAt: { lt: now } }
    })

    if (result.count > 0) {
      this.logger.log(`🧹 Удалено ${result.count} просроченных OTP-кодов`)
    }
  }
}
