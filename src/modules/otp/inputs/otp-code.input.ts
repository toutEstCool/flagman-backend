import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator'

@InputType()
export class SendCodeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('KG')
  public phone: string
}

@InputType()
export class VerifyCodeInput {
  @Field()
  @IsPhoneNumber('KG')
  @IsNotEmpty()
  phone: string

  @Field()
  @IsString()
  @IsNotEmpty()
  code: string
}
