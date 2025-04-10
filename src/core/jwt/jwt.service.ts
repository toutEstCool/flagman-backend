import { Injectable, UnauthorizedException } from '@nestjs/common'
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
    const refreshTokenRecord = await this.prismaService.refreshToken.create({
      data: {
        token: 'placeholder',
        userId: user.id,
        expiresAt: addDays(new Date(), 7)
      }
    })

    const payload = {
      sub: user.id,
      phone: user.phone,
      refreshTokenId: refreshTokenRecord.id
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET')
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN'
      ),
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')
    })

    await this.prismaService.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { token: refreshToken }
    })

    return { accessToken, refreshToken }
  }

  public async verifyAccessToken(token: string): Promise<{ userId: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string
        refreshTokenId: string
      }>(token, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET')
      })

      const exists = await this.prismaService.refreshToken.findUnique({
        where: { id: payload.refreshTokenId }
      })

      if (!exists) {
        throw new UnauthorizedException(
          'Access токен отозван или refresh токен удалён'
        )
      }

      return { userId: payload.sub }
    } catch (err) {
      throw new UnauthorizedException('Недействительный access токен')
    }
  }
}
