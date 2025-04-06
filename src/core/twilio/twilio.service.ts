import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Twilio } from 'twilio'

@Injectable()
export class TwilioService {
  private client: Twilio

  constructor(private config: ConfigService) {
    this.client = new Twilio(
      this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN')
    )
  }

  async sendSms(to: string, body: string) {
    return this.client.messages.create({
      body,
      to,
      from: this.config.getOrThrow<string>('TWILIO_PHONE_NUMBER')
    })
  }
}
