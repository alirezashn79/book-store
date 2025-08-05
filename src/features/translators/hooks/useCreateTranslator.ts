import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ICreateTranslatorProps {
  name: string
  biography?: string
}

async function createTranslator(data: ICreateTranslatorProps) {
  return api().post(endpoints.translators.default, {
    json: data,
  })
}

export default function useCreateTranslator() {
  return useMutation({
    mutationFn: async (params: ICreateTranslatorProps) => {
      return toast.promise(createTranslator(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
