import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { UserMetadata } from '../types/user-metedata.types'

import { IS_DEV_ENV } from './is-dev.util'

import DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

export function GetUserMetadata(req: any, userAgent: string): UserMetadata {
  const ip = IS_DEV_ENV
    ? '185.29.185.226'
    : Array.isArray(req.headers['cf-connecting-ip'])
      ? req.headers['cf-connecting-ip'][0]
      : req.headers['cf-connecting-ip'] ||
        (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for'].split(',')[0]
          : req.ip || req.socket?.remoteAddress || '')

  const device = new DeviceDetector().parse(userAgent)
  const location = lookup(ip)

  return {
    location: location
      ? {
          country: countries.getName(location.country, 'ru') || 'Неизвестно',
          city: location.city || 'Неизвестно',
          latitude: location.ll[0] || 0,
          longitude: location.ll[1] || 0
        }
      : {
          country: 'Неизвестно',
          city: 'Неизвестно',
          latitude: 0,
          longitude: 0
        },
    device: {
      brand: device.device?.brand ?? 'unknown',
      model: device.device?.model ?? 'unknown',
      systemName: device.os?.name ?? 'unknown',
      systemVersion: device.os?.version ?? 'unknown',
      appVersion: device.client?.version ?? 'unknown'
    },
    ip
  }
}
