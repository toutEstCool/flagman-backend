import { applyDecorators } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'

import { ErrorResponse } from '../types/base-response'

export function ApiErrorResponse(message: string, status = 400) {
  return applyDecorators(
    ApiResponse({
      status,
      description: message,
      schema: {
        example: {
          success: false,
          message
        } satisfies ErrorResponse
      }
    })
  )
}
