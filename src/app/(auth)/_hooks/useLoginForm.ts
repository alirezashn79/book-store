import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ILoginFormInputs {
  identifier: string
  password: string
}

async function loginWithPassword(data: ILoginFormInputs) {
  return api({ isAuth: false }).post(endpoints.auth.login, {
    json: data,
  })
}

export default function useLoginForm() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (params: ILoginFormInputs) => {
      return toast.promise(loginWithPassword(params), {
        loading: 'لطفا صبر کنید',
        success: 'با موفقیت وارد شدید!',
      })
    },
    onSuccess: () => {
      router.replace('/')
    },
  })
}
