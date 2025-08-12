import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface IRemoveMediaProps {
  id: string
}

async function removeMedia(data: IRemoveMediaProps) {
  const url = `${endpoints.media}/${data.id.toString()}`
  return api().delete(url)
}

export default function useRemoveMedia() {
  return useMutation({
    mutationFn: async (params: IRemoveMediaProps) => {
      return toast.promise(removeMedia(params), {
        loading: 'لطفا صبر کنید',
        success: 'فایل با موفقیت حذف شد!',
      })
    },
  })
}
