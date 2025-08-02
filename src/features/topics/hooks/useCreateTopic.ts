import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface ICreateTopicProps {
  name: string
  description?: string
}

async function createTopic(data: ICreateTopicProps) {
  return api().post(endpoints.topics.default, {
    json: data,
  })
}

export default function useCreateTopic() {
  return useMutation({
    mutationFn: async (params: ICreateTopicProps) => {
      return toast.promise(createTopic(params), {
        loading: 'لطفا صبر کنید',
        success: 'موفقیت ایجاد شد!',
      })
    },
  })
}
