// hooks/useUppyManager.tsx
'use client'

import { useEffect } from 'react'
import { useRefresh } from '@/hooks/useRefresh'
import { useUppyStore } from '@/stores/uppyStore'

export function useUppyManager() {
  const uppy = useUppyStore((s) => s.uppy)
  const setIsUploading = useUppyStore((s) => s.setIsUploading)

  const refreshMedia = useRefresh(['media'])

  useEffect(() => {
    const onProgress = () => setIsUploading(true)
    const onComplete = () => {
      setIsUploading(false)
      refreshMedia()
    }

    uppy.on('upload-progress', onProgress)
    uppy.on('complete', onComplete)

    return () => {
      uppy.off('upload-progress', onProgress)
      uppy.off('complete', onComplete)
    }
  }, [uppy, refreshMedia, setIsUploading])
}
