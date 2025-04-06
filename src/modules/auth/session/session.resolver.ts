import { Context, Mutation, Resolver } from '@nestjs/graphql'

import { GqlContext } from '@/src/shared/types/gql-context.types'

import { LogoutOutput } from './inputs/logout.output'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => LogoutOutput, { name: 'logoutUser' })
  public async logout(@Context() { req }: GqlContext) {
    await this.sessionService.clearSession(req)

    return {
      success: true,
      message: 'Вы успешно вышли из аккаунта'
    }
  }
}
