import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

@Injectable()
export class SessionService {
  constructor(private readonly configService: ConfigService) {}

  public async setUserSession(req: Request, userId: string): Promise<void> {
    req.session.userId = userId
    req.session.createdAt = new Date()

    return new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          return reject(
            new InternalServerErrorException('Не удалось сохранить сессию')
          )
        }

        resolve()
      })
    })
  }

  public getUserId(req: Request): string | null {
    return req.session.userId ?? null
  }

  public getCreatedAt(req: Request): Date | null {
    const raw = req.session.createdAt
    return raw ? new Date(raw) : null
  }

  public async clearSession(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      const sessionId = req.sessionID

      req.session.destroy(err => {
        if (err) {
          console.error('❌ Ошибка при удалении сессии:', err)
          return reject(
            new InternalServerErrorException('Не удалось завершить сессию')
          )
        }

        // ✅ Явно удаляем сессию из Redis
        req.sessionStore.destroy(sessionId, destroyErr => {
          if (destroyErr) {
            console.error('❌ RedisStore.destroy() ошибка:', destroyErr)
            return reject(
              new InternalServerErrorException(
                'Не удалось удалить сессию из Redis'
              )
            )
          }

          req.res?.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
          )
          console.log(`✅ Сессия ${sessionId} удалена из Redis`)
          resolve()
        })
      })
    })
  }
}
