import ky from 'ky'
import toast from 'react-hot-toast'

export const api = ({ isAuth = true }: { isAuth?: boolean } = {}) => {
  return ky.create({
    prefixUrl: '/api',
    credentials: isAuth ? 'include' : undefined,
    throwHttpErrors: true,
    hooks: {
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
            }
          }
          return error
        },
      ],
    },
  })
}
