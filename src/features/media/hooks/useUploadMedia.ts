'use client'

import { useRefresh } from '@/hooks/useRefresh'
import { createUppy } from '@/libs/createUppy'
import { useEffect, useState } from 'react'

export default function useUploadMedia() {
  const [uppy] = useState(createUppy)
  const [isUploading, setIsUploading] = useState(false)
  const refreshMedia = useRefresh(['media'])
  useEffect(() => {
    const onComplete = async () => {
      setIsUploading(false)
      refreshMedia()
    }

    const onProgress = () => {
      setIsUploading(true)
    }

    uppy.on('upload-progress', onProgress)
    uppy.on('complete', onComplete)

    return () => {
      uppy.off('complete', onComplete)
      uppy.off('upload-progress', onProgress)
    }
  }, [uppy, refreshMedia])

  return { uppy, isUploading, setIsUploading }
}
