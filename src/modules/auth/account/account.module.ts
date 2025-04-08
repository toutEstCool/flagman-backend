import { Module } from '@nestjs/common'

import { JwtModule } from '@/src/core/jwt/jwt.module'
import { PrismaModule } from '@/src/core/prisma/prisma.module'

import { OtpModule } from '../../otp/otp.module'

import { AccountResolver } from './account.resolver'
import { AccountService } from './account.service'

@Module({
  imports: [PrismaModule, JwtModule, OtpModule],
  providers: [AccountResolver, AccountService]
})
export class AccountModule {}
