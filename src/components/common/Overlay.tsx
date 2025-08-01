'use client'
import { cn } from '@/utils/cn'

interface IProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function Overlay({ isOpen, setIsOpen }: IProps) {
  return (
    <div
      onClick={() => setIsOpen(false)}
      className={cn(
        'bg-gray-dark/40 invisible fixed inset-0 z-999 hidden size-0 opacity-0',
        isOpen &&
          'visible block size-full opacity-100 xl:invisible xl:hidden xl:size-0 xl:opacity-0'
      )}
    />
  )
}
