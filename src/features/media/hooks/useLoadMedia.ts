'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useGetMedia from './useGetMedia'

export default function useLoadMedia() {
  const { inView, ref } = useInView()
  const getMedia = useGetMedia()
  const { hasNextPage, fetchNextPage } = getMedia
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  return { ref, getMedia }
}
