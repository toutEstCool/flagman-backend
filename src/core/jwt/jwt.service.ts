import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService as Jwt } from '@nestjs/jwt'
import { addDays } from 'date-fns'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class JwtService {
  public constructor(
    private readonly jwtService: Jwt,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  public async issueTokens(user: { id: string; phone: string }) {
    const payload = { sub: user.id, phone: user.phone }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN')
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN')
    })

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7)
      }
    })

    return { accessToken, refreshToken }
  }
}
