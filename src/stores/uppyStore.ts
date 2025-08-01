import { create } from 'zustand'
import Uppy from '@uppy/core'
import { createUppy } from '@/libs/createUppy'

interface IUppyStore {
  uppy: Uppy
  isUploading: boolean
  setIsUploading: (v: boolean) => void
}

export const useUppyStore = create<IUppyStore>((set) => {
  const uppy = createUppy()

  return {
    uppy,
    isUploading: false,
    setIsUploading: (isUploading) => set({ isUploading }),
  }
})
