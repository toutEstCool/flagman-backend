import { Module } from '@nestjs/common'

import { OtpCleanerService } from '../../../core/otp/otp-cleaner.service'
import { SessionModule } from '../session/session.module'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
  imports: [SessionModule],
  providers: [AccountResolver, AccountService, OtpCleanerService]
})
export class AccountModule {}
