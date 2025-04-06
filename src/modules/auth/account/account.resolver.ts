import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { SendCodeInput, VerifyCodeInput } from './inputs/otp-code.input'
import { OtpSendCodeModel } from './models/otp.model'
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) {}

  @Mutation(() => OtpSendCodeModel, { name: 'sendCode' })
  public async sendCode(@Args('data') input: SendCodeInput) {
    return await this.accountService.sendCode(input)
  }

  @Mutation(() => UserModel, { name: 'verifyCode' })
  public async verifyCode(
    @Args('data') input: VerifyCodeInput
  ): Promise<UserModel> {
    return this.accountService.verifyCode(input)
  }
}
