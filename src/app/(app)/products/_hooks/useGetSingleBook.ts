import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { ApiResponse, IQueryKey } from '@/types/api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { IGetBooks } from '../_types'

interface IProps {
  id: string
}

async function queryFn({ queryKey }: IQueryKey) {
  const id = queryKey[1] as string

  const url = `${endpoints.books.default}/${id}`
  const response = await api().get<ApiResponse<IGetBooks>>(url).json()
  if (!response.success) throw new Error('error to fetch books')

  return response.data
}

export const useGetBooks = ({ id }: IProps) => {
  return useQuery({
    queryKey: ['single-book', id],
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 5000,
  })
}
