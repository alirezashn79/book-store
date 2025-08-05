import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ICreateAuthorProps {
  name: string
  biography?: string
  birthDate?: string
  deathDate?: string
}

async function createAuthor(data: ICreateAuthorProps) {
  return api().post(endpoints.authors.default, {
    json: data,
  })
}

export default function useCreateAuthor() {
  return useMutation({
    mutationFn: async (params: ICreateAuthorProps) => {
      return toast.promise(createAuthor(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
