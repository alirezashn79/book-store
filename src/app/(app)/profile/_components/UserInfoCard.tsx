'use client'

import useGetMe from '@/app/auth/_hooks/useGetMe'

export default function UserInfoCard() {
  const { data: user, isPending: isUserLoading } = useGetMe()

  if (isUserLoading) {
    return <div className="flex items-center justify-center p-5 lg:p-6" />
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
            اطلاعات شخصی
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                نام و نام خانوادگی
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.name}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">ایمیل</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                شماره موبایل
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.phone}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                بیوگرافی
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
