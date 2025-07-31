import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { ApiResponse } from '@/types/api'
import { useQuery } from '@tanstack/react-query'

interface IProps {
  responseType?: boolean
}

async function queryFn(
  responseType: boolean
): Promise<ApiResponse<{ id: number; name: string }[]>> {
  let url = endpoints.categories.default
  if (responseType) url += '?responseType=true'
  return api({ isAuth: false }).get(url).json()
}

export default function useGetCategories({ responseType = false }: IProps) {
  return useQuery({
    queryKey: ['categories-responseType'],
    queryFn: () => queryFn(responseType),
  })
}
