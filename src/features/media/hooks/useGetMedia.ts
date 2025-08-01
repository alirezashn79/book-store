import { endpoints } from '@/endpoints'
import { api } from '@/libs/api'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MediaItem } from '../types'

type UseGetMediaOptions = {
  enabled?: boolean
}

const queryFn = async ({ pageParam = 1 }): Promise<PaginatedResponse<MediaItem>> => {
  const urlParams = new URLSearchParams()
  urlParams.append('page', String(pageParam))
  urlParams.append('limit', '20')

  const url = `${endpoints.media}?${urlParams.toString()}`
  const response = await api().get<ApiResponse<PaginatedResponse<MediaItem>>>(url).json()

  if (!response.success) throw new Error('error to fetch media')

  return response.data
}

export default function useGetMedia(options: UseGetMediaOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['media'],
    initialPageParam: 1,
    queryFn,
    getNextPageParam: (lastpage) => {
      if (lastpage.meta.hasNext) {
        return lastpage.meta.page + 1
      }
    },
    enabled: options.enabled ?? true,
    // اگر نمی‌خواهید به‌ازای هر mount دوباره اجرا شود
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
