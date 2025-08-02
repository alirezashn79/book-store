import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'

interface IProps {
  responseType?: boolean
  options?: { enabled?: boolean }
}

async function queryFn(responseType: boolean) {
  let url = endpoints.translators.default
  if (responseType) url += '?responseType=true'
  const response = await api({ isAuth: false })
    .get<ApiResponse<{ id: number; name: string }[]>>(url)
    .json()

  if (!response.success) throw new Error('error to fetch translators')

  return response.data
}

export default function useGetTranslators({
  responseType = false,
  options = { enabled: true },
}: IProps) {
  return useQuery({
    queryKey: ['translators-responseType'],
    queryFn: () => queryFn(responseType),
    enabled: options.enabled ? true : false,
  })
}
