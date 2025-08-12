import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UpdateUserInput } from '../_types'
import { useRefresh } from '@/hooks/useRefresh'

interface IUpdateUser {
  id: number
  data: UpdateUserInput
}

async function updateMe(params: IUpdateUser) {
  const { id, data } = params
  const url = `${endpoints.users.default}/${id.toString()}`
  return api().put(url, {
    json: data,
  })
}

export default function useUpdateUser() {
  const refreshMe = useRefresh(['auth-me'])
  return useMutation({
    mutationFn: async (params: IUpdateUser) => {
      return toast.promise(updateMe(params), {
        loading: 'لطفا صبر کنید',
        success: 'با موفقیت بروزرسانی شد!',
      })
    },
    onSuccess: () => {
      refreshMe()
    },
  })
}
