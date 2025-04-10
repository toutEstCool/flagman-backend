export interface LocationInfo {
  country: string
  city: string
  latitude: number
  longitude: number
}

export interface DeviceInfo {
  brand: string
  model: string
  systemName: string
  systemVersion: string
  appVersion: string
}

export interface UserMetadata {
  location: LocationInfo
  device: DeviceInfo
  ip: string
}
