'use client'
import useDebounce from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UsePaginatedSearchOptions {
  baseUrl: string
  initialSearch?: string
  initialPage?: number
  debounceDelay?: number
  minSearchLength?: number
}

interface UsePaginatedSearchReturn {
  page: number
  search: string
  isNavigating: boolean
  debouncedSearch: string
  setPage: (page: number) => void
  setSearch: (search: string) => void
  handlePageChange: (newPage: number) => void
  searchValidation: {
    isValid: boolean
    showMinLengthError: boolean
    showSearching: boolean
  }
}

export default function usePaginatedSearch({
  baseUrl,
  initialSearch = '',
  initialPage = 1,
  debounceDelay = 300,
  minSearchLength = 2,
}: UsePaginatedSearchOptions): UsePaginatedSearchReturn {
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState(initialSearch)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  const debouncedSearch = useDebounce(search, debounceDelay)

  useEffect(() => {
    if (debouncedSearch === initialSearch) return

    if (debouncedSearch.length >= minSearchLength) {
      setIsNavigating(true)
      const params = new URLSearchParams()
      params.set('search', debouncedSearch)
      params.set('page', '1')
      router.push(`${baseUrl}?${params.toString()}`)
      setPage(1)
    } else if (debouncedSearch.length === 0) {
      router.push(baseUrl)
    }

    const timeout = setTimeout(() => setIsNavigating(false), 300)
    return () => clearTimeout(timeout)
  }, [debouncedSearch, initialSearch, router, baseUrl, minSearchLength])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    params.set('page', newPage.toString())
    router.push(`${baseUrl}?${params.toString()}`)
  }

  return {
    page,
    search,
    isNavigating,
    debouncedSearch,
    setPage,
    setSearch,
    handlePageChange,
    searchValidation: {
      isValid: search.length === 0 || search.length >= minSearchLength,
      showMinLengthError: search.length > 0 && search.length < minSearchLength,
      showSearching: isNavigating,
    },
  }
}
