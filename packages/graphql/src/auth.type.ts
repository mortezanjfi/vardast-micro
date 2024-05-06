import { User as BaseUser } from "./generated"

export interface Session {
  accessToken?: string
  refreshToken?: string
  accessTokenTtl?: number
  refreshTokenTtl?: number
  error?: string
  profile: BaseUser
  abilities: string[]
}

export interface User {
  accessToken?: string
  refreshToken?: string
  accessTokenTtl?: number
  refreshTokenTtl?: number
  userId: number
  profile: BaseUser
  abilities: string[]
  roles?: BaseUser["roles"]
}
