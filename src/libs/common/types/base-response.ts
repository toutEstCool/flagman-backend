export interface BaseResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface ErrorResponse {
  success: false
  message: string
}
