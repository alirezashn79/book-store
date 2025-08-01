'use client'
import { create } from 'zustand'

interface IContextMenu {
  x: number
  y: number
  visible?: boolean
  itemId?: string | number | null
  setPosition: (x: number, y: number) => void
  setVisible: (visible: boolean) => void
  setItemId: (itemId: string | number | null) => void
  setClear: () => void
  setResetContext: () => void
}

export const useContextMenuStore = create<IContextMenu>((set) => ({
  x: 0,
  y: 0,
  visible: false,
  itemId: null,
  setPosition: (x, y) => set({ x, y }),
  setVisible: (visible) => set({ visible }),
  setItemId: (itemId) => set({ itemId }),
  setClear: () => {
    set({ x: 0, y: 0, itemId: null, visible: false })
  },
  setResetContext: () => {
    set({ x: 0, y: 0, visible: false })
  },
}))
