import { User } from '@prisma/client'
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: string
    createdAt?: Date | string
  }
}
