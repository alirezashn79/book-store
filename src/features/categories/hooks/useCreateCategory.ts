import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ICreateCategoryProps {
  name: string
  description?: string
  parentId?: number
}

async function removeMedia(data: ICreateCategoryProps) {
  return api().post(endpoints.categories.default, {
    json: data,
  })
}

export default function useCreateCategory() {
  return useMutation({
    mutationFn: async (params: ICreateCategoryProps) => {
      return toast.promise(removeMedia(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
