import { api } from '@/libs/api'
import { ApiResponse, IQueryKey, PaginatedResponse } from '@/types/api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { IGetBooks } from '../_types'
import { endpoints } from '@/endpoints'

interface IProps {
  page: number | string
  search: string
}

async function queryFn({ queryKey }: IQueryKey) {
  const page = queryKey[1] ?? 1
  const search = queryKey[2] as string
  const urlParams = new URLSearchParams()
  urlParams.append('page', String(page))
  if (search) {
    if (search.length < 2) {
      urlParams.delete('search')
    } else {
      urlParams.append('search', search as string)
    }
  } else {
    urlParams.delete('search')
  }
  urlParams.append('limit', '10')

  const url = `${endpoints.books.default}?${urlParams.toString()}`
  const response = await api().get<ApiResponse<PaginatedResponse<IGetBooks>>>(url).json()
  if (!response.success) throw new Error('error to fetch books')

  return response.data
}

export const useGetBooks = ({ page, search }: IProps) => {
  return useQuery({
    queryKey: ['books', page, search],
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 5000,
  })
}
