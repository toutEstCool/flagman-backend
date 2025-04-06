import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LogoutOutput {
  @Field()
  success: boolean

  @Field()
  message: string
}
