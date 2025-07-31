import ky from 'ky'
import toast from 'react-hot-toast'

export const api = ({ isAuth = true }: { isAuth?: boolean } = {}) => {
  return ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_BASE_URL + '/api',
    credentials: isAuth ? 'include' : undefined,
    throwHttpErrors: true,
    hooks: {
      //   beforeRequest: [
      //     (request) => {
      //       if (isAuth) {
      //         const token = cookie.get('accessToken')
      //         console.log('token', token)
      //         if (token) {
      //           request.headers.set('Authorization', `Bearer ${token}`)
      //         }
      //       }
      //     },
      //   ],
      beforeError: [
        async (error) => {
          const { response } = error
          if (response) {
            try {
              const body = await response.clone().json()
              if (!body.success && body.message) {
                toast.error(body.message)
              }
            } catch {
              toast.error('خطای شبکه یا پاسخ نامعتبر')
            } finally {
              if (response.status === 401) {
                window.location.href = '/dashboard/signin'
              }
            }
          }
          return error
        },
      ],
    },
  })
}
