import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { AuthModule } from './auth/auth.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { PrismaModule } from './prisma/prisma.module'
import { TwilioModule } from './twilio/twilio.module'
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    TwilioModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
