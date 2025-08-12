export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export interface IGetMe {
  id: number
  name: string
  email: string
  role: UserRole
  phone?: string | null
  isActive: boolean
  createdAt: string
  bio?: string | null
  avatar?: string | null
  avatarBlurDataURL?: string | null
  instagram?: string | null
  twitter?: string | null
  linkedin?: string | null
  city?: string | null
  country?: string | null
}
