# 📘 Prisma Schema Documentation

_Generated on 2025-03-30_

Этот документ описывает базовую структуру Prisma-схемы для проекта недвижимости, включающего пользователей, объявления, чаты, сообщения, избранное, жалобы и другие ключевые сущности.

---

## 📦 Models

- [`User`](#user)
- [`Listing`](#listing)
- [`Favorite`](#favorite)
- [`Subscription`](#subscription)
- [`Chat`](#chat)
- [`Message`](#message)
- [`City`](#city)
- [`ActivityLog`](#activitylog)
- [`Complaint`](#complaint)

---

## 👤 User

Представляет зарегистрированного пользователя платформы.

| Поле         | Тип        | Описание |
|--------------|------------|----------|
| id           | Int        | ID пользователя |
| email        | String?    | Email (уникальный, опциональный) |
| phone        | String?    | Телефон (уникальный, опциональный) |
| name         | String?    | Имя |
| avatarUrl    | String?    | Ссылка на аватар |
| city         | String?    | Город |
| isVerified   | Boolean    | Подтверждён ли пользователь |
| role         | UserRole   | Роль (user, admin, и т.д.) |
| status       | UserStatus | Статус (active, banned и т.д.) |
| authType     | AuthType   | Тип авторизации |
| lastLogin    | DateTime?  | Последний вход |
| meta         | Json?      | Дополнительные мета-данные |
| createdAt    | DateTime   | Дата создания |
| updatedAt    | DateTime   | Дата обновления |

Связи:

- `listings`: объявления пользователя
- `favorites`: избранные объявления
- `chats`: чаты
- `messages`: сообщения
- `subscriptions`, `activityLogs`, `complaintsSent`, `complaintsToMe`

---

## 🏠 Listing

Объявление о недвижимости.

| Поле         | Тип          | Описание |
|--------------|--------------|----------|
| id           | Int          | ID |
| title        | String       | Заголовок |
| description  | String       | Описание |
| price        | Int          | Цена |
| type         | ListingType  | Тип (sale/rent) |
| propertyType | PropertyType | Тип недвижимости |
| address      | String       | Адрес |
| cityId       | Int?         | ID города |
| latitude     | Float        | Широта |
| longitude    | Float        | Долгота |
| area         | Float        | Площадь в м² |
| rooms        | Int?         | Кол-во комнат |
| floor        | Int?         | Этаж |
| totalFloors  | Int?         | Всего этажей |
| status       | ListingStatus| Статус |
| isPremium    | Boolean      | Продвигаемое? |
| images       | String[]     | Массив ссылок на фото |
| slug         | String?      | Уникальный slug |
| viewCount    | Int          | Просмотры |
| contactCount | Int          | Кол-во контактов |
| createdAt    | DateTime     | Когда создано |
| updatedAt    | DateTime     | Когда обновлено |
| deletedAt    | DateTime?    | Мягкое удаление |

Связи:
`author`, `favorites`, `subscriptions`, `chats`, `Complaint`

---

## ⭐ Favorite

Избранное объявление пользователя.

| Поле        | Тип      | Описание |
|-------------|----------|----------|
| id          | Int      | ID |
| userId      | Int      | ID пользователя |
| listingId   | Int      | ID объявления |
| createdAt   | DateTime | Когда добавлено |

Уникальное ограничение: один пользователь — одна избранная запись на объявление.

---

## 📩 Subscription

Подписка пользователя на фильтры.

| Поле        | Тип      | Описание |
|-------------|----------|----------|
| id          | Int      | ID |
| userId      | Int      | ID пользователя |
| listingId   | Int?     | Конкретное объявление (если есть) |
| filter      | Json     | Условия фильтра |
| createdAt   | DateTime | Когда создана |

---

## 💬 Chat

Диалог между пользователем и автором объявления.

| Поле        | Тип      | Описание |
|-------------|----------|----------|
| id          | Int      | ID чата |
| userId      | Int      | Инициатор |
| listingId   | Int      | Объявление |
| unreadCount | Int      | Непрочитанные сообщения |
| lastMessageAt | DateTime? | Дата последнего сообщения |

Связи: `user`, `listing`, `messages`

---

## 📨 Message

Сообщение в чате.

| Поле      | Тип      | Описание |
|-----------|----------|----------|
| id        | Int      | ID |
| chatId    | Int      | ID чата |
| senderId  | Int      | Отправитель |
| content   | String   | Текст |
| createdAt | DateTime | Время отправки |

---

## 🗺️ City

Город, используется в объявлениях.

| Поле      | Тип     | Описание |
|-----------|---------|----------|
| id        | Int     | ID |
| name      | String  | Название |
| region    | String? | Регион |
| latitude  | Float   | Широта |
| longitude | Float   | Долгота |
| rating    | Int     | Популярность |

---

## 📈 ActivityLog

Лог действий пользователя.

| Поле      | Тип     | Описание |
|-----------|---------|----------|
| id        | Int     | ID |
| userId    | Int     | Кто |
| action    | String  | Что сделал |
| meta      | Json?   | Доп. данные |
| createdAt | DateTime | Время события |

---

## 🚨 Complaint

Жалоба на пользователя, сообщение или объявление.

| Поле        | Тип      | Описание |
|-------------|----------|----------|
| id          | Int      | ID |
| senderId    | Int      | Кто пожаловался |
| receiverId  | Int?     | На кого |
| listingId   | Int?     | Объявление |
| messageId   | Int?     | Сообщение |
| reason      | String   | Причина |
| status      | ComplaintStatus | Статус |
| createdAt   | DateTime | Дата создания |

Связи: `sender`, `receiver`, `listing`, `message`

---

## 🔠 Enums

### `UserRole`
- `user`
- `admin`
- `agent`
- `developer`

### `UserStatus`
- `active`
- `banned`
- `inactive`

### `AuthType`
- `phone`
- `email`
- `social`

### `ListingType`
- `sale`
- `rent`

### `PropertyType`
- `apartment`
- `house`
- `land`
- `commercial`

### `ListingStatus`
- `active`
- `hidden`
- `archived`
- `draft`

### `ComplaintStatus`
- `open`
- `reviewed`
- `rejected`
- `resolved`
