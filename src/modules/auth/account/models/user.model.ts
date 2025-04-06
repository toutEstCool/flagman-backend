import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  avatarUrl?: string

  @Field({ nullable: true })
  city?: string

  @Field()
  isVerified: boolean

  @Field()
  isTwoFactorEnabled: boolean

  @Field({ nullable: true })
  deletedAt?: Date

  @Field()
  role: string

  @Field()
  status: string

  @Field()
  authType: string

  @Field({ nullable: true })
  lastLogin?: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => String, { nullable: true })
  meta?: any
}
