import { create } from 'zustand'

interface IMediaSelectorStore {
  selectedMedias: string[]
  setSelectedMedias: (selectedMedias: string[]) => void
  count: number
  setCount: (count: number) => void
}
const useMediaSelectorStore = create<IMediaSelectorStore>((set) => ({
  selectedMedias: [],
  count: 2,

  setSelectedMedias: (selectedMedias) => set({ selectedMedias }),
  setCount: (count) => set({ count }),
}))

export default useMediaSelectorStore
