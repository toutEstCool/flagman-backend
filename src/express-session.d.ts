import { User } from '@prisma/client'
import 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId?: string
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
