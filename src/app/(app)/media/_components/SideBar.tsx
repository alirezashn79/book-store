'use client'

import { CloseLineIcon } from '@/icons'
import { cn } from '@/utils/cn'
import React, { useEffect } from 'react'
import Overlay from '../../../../components/common/Overlay'

interface IProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title?: string
  children?: React.ReactNode
}

export default function SideBar({ isOpen, setIsOpen, title, children }: IProps) {
  //   const { setClear } = useContextMenu()

  useEffect(() => {
    const onSkape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onSkape)

    return () => {
      window.removeEventListener('keydown', onSkape)
    }
  }, [])

  //   useEffect(() => {
  //     if (!isOpen) return
  //     setClear()
  //   }, [isOpen, setClear])

  return (
    <>
      <aside
        className={cn(
          'fixed -end-[30rem] top-0 bottom-0 z-9999 w-auto overflow-hidden rounded-md bg-white shadow transition-all xl:sticky xl:-end-0 xl:z-99909 xl:h-[calc(100vh-170px)] xl:w-0 dark:bg-gray-800',
          isOpen && 'end-0 w-72 xl:w-1/4'
        )}
      >
        <div className="mt-16 size-full xl:mt-0">
          <div className="flex items-center justify-between px-3 py-2">
            <button onClick={() => setIsOpen(false)} className="size-8">
              <CloseLineIcon />
            </button>
            {title && <span className="text-sm">{title}</span>}
          </div>
          <hr />

          <div className="h-full overflow-auto px-2 pt-2 pb-4">{children}</div>
        </div>
      </aside>

      <Overlay isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
