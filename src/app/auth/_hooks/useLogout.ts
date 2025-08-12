import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const logoutHandler = async () => {
  return api().get(endpoints.auth.logout)
}

export default function useLogout() {
  const router = useRouter()
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return toast.promise(logoutHandler, {
        loading: 'لطفا صبر کنید',
        success: 'با موفقیت خارج شدید!',
      })
    },
    onSuccess: () => {
      router.replace('/auth/signin')
    },
  })
}
