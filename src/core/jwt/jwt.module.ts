import { Global, Module } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'

import { JwtService } from './jwt.service'

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret',
      signOptions: { expiresIn: '15m' }
    })
  ],
  providers: [JwtService],
  exports: [JwtService]
})
export class JwtModule {}
