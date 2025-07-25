import { compare, hash } from 'bcryptjs'

export async function hashPass(password: string, salt = 12) {
  const hashedPass = await hash(password, salt)
  return hashedPass
}

export async function comparePass(pass: string, hashed: string) {
  const result = await compare(pass, hashed)
  return result
}
