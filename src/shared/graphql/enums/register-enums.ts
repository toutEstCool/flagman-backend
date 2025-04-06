import { registerEnumType } from '@nestjs/graphql'

import { AuthType, UserRole, UserStatus } from '@/prisma/generated'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Роль пользователя: user, admin, agent, developer'
})

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'Статус пользователя: active, banned, inactive'
})

registerEnumType(AuthType, {
  name: 'AuthType',
  description: 'Тип авторизации: phone, email, social'
})
