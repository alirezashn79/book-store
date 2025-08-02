import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ICreateBookSchemaType } from '../schema'

async function createBook(data: ICreateBookSchemaType) {
  return api().post(endpoints.books.default, {
    json: data,
  })
}

export default function useCreateBook() {
  return useMutation({
    mutationFn: async (params: ICreateBookSchemaType) => {
      return toast.promise(createBook(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
