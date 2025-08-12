'use client'

import { useTheme } from '@/context/ThemeContext'
import { useUppyStore } from '@/stores/uppyStore'
import Dashboard from '@uppy/react/lib/Dashboard'

export default function MediaUploader() {
  const { theme } = useTheme()
  const uppy = useUppyStore((s) => s.uppy)
  return (
    <Dashboard theme={theme} uppy={uppy} width="100%" height="100%" showProgressDetails={true} />
  )
}
