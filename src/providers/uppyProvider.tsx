'use client'

import { useUppyManager } from '@/hooks/useUppyManager'

export default function UppyProvider() {
  useUppyManager()
  return null
}
