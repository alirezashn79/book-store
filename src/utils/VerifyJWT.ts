import { jwtVerify, JWTPayload } from 'jose'

export async function verifyJWT(token: string, secretKey: string): Promise<JWTPayload | null> {
  try {
    // jose expects a Uint8Array for the secret
    const encoder = new TextEncoder()
    const { payload } = await jwtVerify(token, encoder.encode(secretKey))
    return payload
  } catch (e) {
    // نامعتبر یا منقضی‌شده
    console.error('JWT verification failed:', e)
    return null
  }
}
