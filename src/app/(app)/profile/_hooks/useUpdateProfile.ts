import { endpoints } from '@/endpoints'
import { useRefresh } from '@/hooks/useRefresh'
import { api } from '@/libs/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface IUpdateProfile {
  id: number
  avatar: File
}

async function updateMe(params: IUpdateProfile) {
  const { id, avatar } = params
  const formData = new FormData()
  formData.append('avatar', avatar)

  const url = `${endpoints.users.default}/${id.toString()}`
  return api().patch(url, {
    body: formData,
  })
}

export default function useUpdateProfile() {
  const refreshMe = useRefresh(['auth-me'])
  return useMutation({
    mutationFn: async (params: IUpdateProfile) => {
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
