import { create } from 'zustand'

interface IMediaSelectorStore {
  selectedMedias: string[]
  setSelectedMedias: (selectedMedias: string[]) => void
}
const useMediaSelectorStore = create<IMediaSelectorStore>((set) => ({
  selectedMedias: [],

  setSelectedMedias: (selectedMedias) => set({ selectedMedias }),
}))

export default useMediaSelectorStore
