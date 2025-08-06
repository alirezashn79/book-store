import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { IBookUpdateSchemaType } from '../schema'

interface IUpdateBookProps {
  id: number
  data: IBookUpdateSchemaType
}

async function createBook(params: IUpdateBookProps) {
  const { id, data } = params
  const url = `${endpoints.books.default}/${id.toString()}`
  return api().put(url, {
    json: data,
  })
}

export default function useUpdateBook() {
  return useMutation({
    mutationFn: async (params: IUpdateBookProps) => {
      return toast.promise(createBook(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت بروزرسانی شد!',
      })
    },
  })
}
