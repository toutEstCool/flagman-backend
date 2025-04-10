import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    let userAgent: string | string[] | undefined

    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest() as Request

      userAgent = req.headers['user-agent']
    } else {
      const context = GqlExecutionContext.create(ctx)
      userAgent = context.getContext().req.headers['user-agent']
    }

    return Array.isArray(userAgent) ? userAgent[0] : userAgent
  }
)
