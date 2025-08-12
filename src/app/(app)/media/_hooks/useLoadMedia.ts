'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useGetMedia from './useGetMedia'

type UseGetMediaOptions = {
  enabled?: boolean
}

export default function useLoadMedia(options: UseGetMediaOptions = {}) {
  const { inView, ref } = useInView()
  const getMedia = useGetMedia(options)
  const { hasNextPage, fetchNextPage } = getMedia
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  return { ref, getMedia }
}
