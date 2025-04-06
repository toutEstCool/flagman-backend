import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService as Jwt } from '@nestjs/jwt'

@Injectable()
export class JwtService {
  public constructor(
    private readonly jwtService: Jwt,
    private readonly configService: ConfigService
  ) {}

  public async issueTokens(user: { id: string; phone: string }) {
    const payload = { sub: user.id, phone: user.phone }

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN')
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN')
    })

    return { accessToken, refreshToken }
  }
}
