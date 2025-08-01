'use client'

import { useContextMenuStore } from '@/stores/contextMenuStore'

interface IProps {
  items: {
    title: string
    onClick: () => void | Promise<void>
  }[]
}

export default function ContextMenu({ items }: IProps) {
  const { x, y, visible } = useContextMenuStore()

  if (!visible) return null

  return (
    <ul
      className="fixed z-50 min-w-[120px] overflow-hidden rounded-md bg-white text-sm shadow-md dark:bg-gray-800"
      style={{ top: y, left: x }}
    >
      {items.map(({ title, onClick }, index) => (
        <li
          key={index}
          className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClick}
        >
          {title}
        </li>
      ))}
    </ul>
  )
}
