import { Injectable } from '@nestjs/common'
import { randomInt } from 'crypto'

@Injectable()
export class AuthService {
  public async sendCode() {
    const code = randomInt(100000, 999999).toString()

    console.log(`[DEBUG] OTP-код для теста: ${code}`)
  }

  public async verifyCode() {}
}
