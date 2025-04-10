import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { SendCodeInput, VerifyCodeInput } from '../../otp/inputs/otp-code.input'
import { OtpSendCodeModel } from '../../otp/models/otp.model'

import { AccountService } from './account.service'
import { AuthPayload, UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
  public constructor(private readonly accountService: AccountService) {}

  @Mutation(() => OtpSendCodeModel, { name: 'sendCode' })
  public async sendCode(@Args('data') input: SendCodeInput) {
    return await this.accountService.sendCode(input)
  }

  @Mutation(() => AuthPayload, { name: 'verifyCode' })
  public async verifyCode(
    @Args('data') input: VerifyCodeInput
  ): Promise<AuthPayload> {
    return this.accountService.verifyCode(input)
  }

  @Authorization()
  @Query(() => UserModel, { name: 'getMe' })
  public async getMe(@Authorized('id') id: string) {
    return this.accountService.getMe(id)
  }
}
