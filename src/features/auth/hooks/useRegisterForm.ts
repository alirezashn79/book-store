import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { RegisterApiValues } from '../schema/register'

async function registerWithPassword(data: RegisterApiValues) {
  return api({ isAuth: false }).post(endpoints.auth.register, {
    json: data,
  })
}

export default function useRegisterForm() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (params: RegisterApiValues) => {
      return toast.promise(registerWithPassword(params), {
        loading: 'لطفا صبر کنید',
        success: 'با موفقیت ثبت نام شدید!',
      })
    },
    onSuccess: () => {
      router.replace('/dashboard')
    },
  })
}
