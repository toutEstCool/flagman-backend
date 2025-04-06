import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'

import { AccountModule } from '../modules/auth/account/account.module'
import { SessionModule } from '../modules/auth/session/session.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './config/graphql.config'
import { CoreResolver } from './core.resolver'
import { JwtModule } from './jwt/jwt.module'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { TwilioModule } from './twilio/twilio.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: getGraphQLConfig,
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    JwtModule,
    RedisModule,
    TwilioModule,
    AccountModule,
    SessionModule
  ],
  providers: [CoreResolver]
})
export class CoreModule {}
