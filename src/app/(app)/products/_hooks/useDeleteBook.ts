import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface IRemoveBookProps {
  id: string
}

async function removeBook(data: IRemoveBookProps) {
  const url = `${endpoints.books.default}/${data.id.toString()}`
  return api().delete(url)
}

export default function useDeleteBook() {
  return useMutation({
    mutationFn: async (params: IRemoveBookProps) => {
      return toast.promise(removeBook(params), {
        loading: 'لطفا صبر کنید',
        success: 'محصول با موفقیت حذف شد!',
      })
    },
  })
}
