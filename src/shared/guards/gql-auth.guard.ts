import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { JwtService } from '@/src/core/jwt/jwt.service'
import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req

    const authHeader = request.headers.authorization || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      throw new UnauthorizedException('Пользователь не авторизован')
    }

    let payload: { userId: string }

    try {
      payload = await this.jwtService.verifyAccessToken(token)
    } catch (err) {
      throw new UnauthorizedException('Недействительный токен')
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }
    request.user = user

    return true
  }
}
