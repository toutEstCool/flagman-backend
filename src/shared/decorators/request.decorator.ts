import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

export const Req = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Request => {
    const gqlCtx = GqlExecutionContext.create(ctx)
    return gqlCtx.getContext().req
  }
)
