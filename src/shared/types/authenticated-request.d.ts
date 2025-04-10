import { User } from '@prisma/client'
import { Request } from 'express'

import type { UserMetadata } from './user-metadata.types'

export interface AuthenticatedRequest extends Request {
  user?: User
  metadata?: UserMetadata
}
