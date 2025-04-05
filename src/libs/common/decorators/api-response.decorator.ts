import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

import { BaseResponseDto } from '../dto/base-response.dto'

export function ApiBaseResponse<TModel extends Type<any>>(
  model: TModel,
  description = 'Успешный ответ',
  status = 200
) {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) }
            }
          }
        ]
      }
    })
  )
}
