import { Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class CoreResolver {
  @Query(() => String)
  ping(): string {
    return 'pong'
  }
}
