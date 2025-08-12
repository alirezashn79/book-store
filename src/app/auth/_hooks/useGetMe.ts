import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import { IGetMe } from '../_types/me'

async function queryFn() {
  const response = await api({ isAuth: false }).get<ApiResponse<IGetMe>>(endpoints.auth.me).json()

  if (!response.success) throw new Error('error to fetch authors')

  return response.data
}

export default function useGetMe() {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn,
  })
}
