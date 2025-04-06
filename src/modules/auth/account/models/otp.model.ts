import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OtpSendCodeModel {
  @Field()
  success: boolean

  @Field()
  message: string

  @Field({ nullable: true })
  nextTryIn?: number

  @Field({ nullable: true })
  expiresAt?: Date
}
