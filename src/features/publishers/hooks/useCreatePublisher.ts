import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ICreatePublisherProps {
  name: string
  description?: string
  website?: string
}

async function createPublisher(data: ICreatePublisherProps) {
  return api().post(endpoints.publishers.default, {
    json: data,
  })
}

export default function useCreatePublisher() {
  return useMutation({
    mutationFn: async (params: ICreatePublisherProps) => {
      return toast.promise(createPublisher(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
