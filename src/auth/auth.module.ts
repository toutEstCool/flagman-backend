import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OtpCleanerService } from './otp-cleaner.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, OtpCleanerService]
})
export class AuthModule {}
