'use client'

import { useContextMenuStore } from '@/stores/contextMenuStore'
import { useEffect } from 'react'

const useContextMenu = () => {
  const { x, y, visible, itemId, setPosition, setVisible, setItemId, setResetContext, setClear } =
    useContextMenuStore()

  const onRightClick = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault()
    setItemId(id)
    setPosition(e.clientX, e.clientY)
    setVisible(true)
  }

  useEffect(() => {
    const handleClick = () => {
      setResetContext()
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setResetContext()
      }
    }
    window.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleClick)
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleClick)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return { onRightClick, x, y, visible, itemId, setClear }
}

export default useContextMenu
