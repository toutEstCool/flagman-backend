import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const userId = req.session?.userId

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (user) {
        req.user.id
      }
    }

    next()
  }
}
