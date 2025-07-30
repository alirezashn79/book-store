import ky from 'ky'
import Cookies from 'js-cookie'

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL + '/api',
  credentials: 'include',
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Cookies.get('accessToken')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})
