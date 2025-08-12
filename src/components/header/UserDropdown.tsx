'use client'
import useGetMe from '@/app/auth/_hooks/useGetMe'
import useLogout from '@/app/auth/_hooks/useLogout'
import { LogOut, UserCircle2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: user, isPending: isUserPending } = useGetMe()
  const { mutateAsync: logout, isPending } = useLogout()

  const handleLogout = async () => {
    await logout()
  }

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  function closeDropdown() {
    setIsOpen(false)
  }

  if (isUserPending) {
    return (
      <div className="flex h-10 w-36 items-center justify-center">
        <PulseLoader color="#3641f5" size={10} />
      </div>
    )
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="me-3 h-11 w-11 overflow-hidden rounded-full">
          <Image width={44} height={44} src={user?.avatar ?? ''} alt="User" />
        </span>

        <span className="text-theme-sm me-1 block font-medium">{user?.name}</span>

        <svg
          className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="shadow-theme-lg dark:bg-gray-dark absolute end-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800"
      >
        <div>
          <span className="text-theme-sm block font-medium text-gray-700 dark:text-gray-400">
            {user?.name}
          </span>
          <span className="text-theme-xs mt-0.5 block text-gray-500 dark:text-gray-400">
            {user?.email ?? user?.phone}
          </span>
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 pt-4 pb-3 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="group text-theme-sm flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserCircle2 />
              ویرایش پروفایل
            </DropdownItem>
          </li>
        </ul>
        <button
          disabled={isPending}
          onClick={handleLogout}
          className="group text-theme-sm mt-3 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut />
          خروج
        </button>
      </Dropdown>
    </div>
  )
}
