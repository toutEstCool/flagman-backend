import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { Req } from '@/src/shared/decorators/request.decorator'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator'

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
    @Args('data') input: VerifyCodeInput,
    @UserAgent() userAgent: string,
    @Req() req: Request
  ): Promise<AuthPayload> {
    return this.accountService.verifyCode(input, req, userAgent)
  }

  @Authorization()
  @Query(() => UserModel, { name: 'getMe' })
  public async getMe(@Authorized('id') id: string) {
    return this.accountService.getMe(id)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Authorized('id') userId: string): Promise<boolean> {
    const result = await this.accountService.logout(userId)

    return result.success
  }
}
