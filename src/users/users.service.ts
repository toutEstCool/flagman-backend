import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public async getMe(req: Request) {
    const userId = req.session.userId

    if (!userId) {
      throw new UnauthorizedException({
        success: false,
        message: 'Пользователь не авторизован'
      })
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatarUrl: true,
        city: true,
        isVerified: true,
        isTwoFactorEnabled: true,
        role: true,
        status: true,
        authType: true,
        lastLogin: true,
        createdAt: true
      }
    })

    return {
      success: true,
      message: 'Данные пользователя',
      data: user
    }
  }
}
