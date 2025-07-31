'use client'
import { useTheme } from '@/context/ThemeContext'
import useGetMedia from '@/features/media/hooks/useGetMedia'
import { createUppy } from '@/libs/createUppy'
import { cn } from '@/utils/cn'
import Dashboard from '@uppy/react/lib/Dashboard'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { MediaItem } from '../types'
import useRemoveMedia from '../hooks/useRemoveMedia'
import Alert from '@/components/ui/alert/Alert'

export default function MedisList() {
  const [uppy] = useState(createUppy)
  const [isUploading, setIsUploading] = useState(false)
  const [isDelete, setIsDelete] = useState(false)

  const { theme } = useTheme()
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const { inView, ref } = useInView()
  const {
    data: media,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
    refetch,
    isRefetching,
  } = useGetMedia()
  const { mutateAsync: deleteMedia, isPending: isDeleting } = useRemoveMedia()

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  useEffect(() => {
    const onComplete = async () => {
      console.log('uploaded complete')
      await refetch()
      setIsUploading(false)
    }

    uppy.on('upload-progress', () => {
      setIsUploading(true)
      console.log('uploading')
    })
    uppy.on('complete', onComplete)

    return () => {
      uppy.off('complete', onComplete)
      uppy.off('upload-progress', onComplete)
    }
  }, [uppy, refetch])

  // state مربوط به منوی راست‌کلیک
  const [ctxMenu, setCtxMenu] = useState<{
    visible: boolean
    x: number
    y: number
    item?: MediaItem
  }>({
    visible: false,
    x: 0,
    y: 0,
  })

  const resetCtxMenu = () =>
    setCtxMenu({
      visible: false,
      x: 0,
      y: 0,
    })

  // برای مخفی‌کردن منو وقتی کاربر کلیک چپ یا اسکیپ زد
  useEffect(() => {
    const handleClick = () => setCtxMenu((m) => ({ ...m, visible: false }))
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpenSidebar(false)
        setCtxMenu((m) => ({ ...m, visible: false }))
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

  // هندلر راست‌کلیک روی هر آیتم
  const onRightClick = (e: React.MouseEvent, item: MediaItem) => {
    e.preventDefault()
    setCtxMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item,
    })
  }

  return (
    <>
      {isDelete && (
        <div className="mb-2 transition-all">
          <Alert
            variant="warning"
            title={`فایل حذف شود؟`}
            isConfirm
            onConfirm={async () => {
              await deleteMedia(
                { id: ctxMenu.item!.id },
                {
                  onSuccess: async () => {
                    setIsDelete(false)
                    await refetch()
                    resetCtxMenu()
                  },
                }
              )
            }}
            isLoading={isDeleting}
            onCancel={() => setIsDelete(false)}
          />
        </div>
      )}
      {isRefetching && <p className="my-4 animate-pulse text-center">در حال بروزرسانی...</p>}
      {isUploading && <p className="my-4 animate-pulse text-center">در حال آپلود...</p>}
      <div
        className={cn(
          'relative flex w-full overflow-x-hidden xl:h-[calc(100vh-170px)]',
          isOpenSidebar && 'lg:gap-4'
        )}
      >
        <div className={cn('w-full transition-all xl:w-full', isOpenSidebar && 'xl:w-4/5')}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <div className="col-span-2 row-span-2 min-h-80 md:col-span-3 lg:col-span-2 lg:h-full">
              <Dashboard
                theme={theme}
                uppy={uppy}
                width="100%"
                height="100%"
                showProgressDetails={true}
              />
            </div>
            {media &&
              media.pages
                .flatMap((group) => group.data)
                .map((mediaItem) => (
                  <div
                    onContextMenu={(e) => onRightClick(e, mediaItem)}
                    key={mediaItem.id}
                    className={cn(
                      'h-40 overflow-hidden rounded-md bg-gray-100 transition-transform',
                      (isDeleting || isRefetching) &&
                        ctxMenu.item?.id === mediaItem.id &&
                        'scale-95 animate-pulse'
                    )}
                  >
                    <Image
                      height={160}
                      width={160}
                      placeholder="blur"
                      blurDataURL={mediaItem.blurDataURL}
                      src={mediaItem.url}
                      alt={mediaItem.fileName}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
            {ctxMenu.visible && (
              <ul
                className="fixed z-50 min-w-[120px] overflow-hidden rounded-md bg-white text-sm shadow-md transition-all dark:bg-gray-800"
                style={{ top: ctxMenu.y, left: ctxMenu.x }}
              >
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    if (ctxMenu.item) window.open(ctxMenu.item.url, '_blank')
                    setCtxMenu((m) => ({ ...m, visible: false }))
                  }}
                >
                  باز کردن در تب جدید
                </li>

                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={async () => {
                    setCtxMenu((m) => ({ ...m, visible: false }))
                    setIsDelete(true)
                  }}
                >
                  حذف
                </li>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsOpenSidebar(true)
                    setCtxMenu((m) => ({ ...m, visible: false }))
                  }}
                >
                  جزییات
                </li>
              </ul>
            )}
            <div ref={ref} className="col-span-2 h-0.5 w-full md:col-span-3 xl:col-span-4" />
            {isFetchingNextPage && (
              <div className="col-span-2 flex h-2 w-full animate-pulse justify-center md:col-span-3 xl:col-span-4">
                در حال بارگذاری...
              </div>
            )}

            {isPending && (
              <div className="col-span-2 flex h-40 w-full justify-center md:col-span-3 xl:col-span-4">
                <div className="size-8 animate-spin rounded-full border-t-2 border-blue-500" />
              </div>
            )}
          </div>
        </div>
        <div
          className={cn(
            'fixed -end-96 top-0 bottom-0 z-999099 w-auto overflow-hidden rounded-md bg-white shadow transition-all xl:sticky xl:-end-0 xl:z-99909 xl:h-[calc(100vh-170px)] xl:w-0 dark:bg-gray-800',
            isOpenSidebar && 'end-0 w-72 xl:w-1/5'
          )}
        >
          <div className="size-full p-4">
            <button onClick={() => setIsOpenSidebar(false)}>close</button>
          </div>
        </div>
        <div
          onClick={() => {
            setIsOpenSidebar(false)
          }}
          className={cn(
            'bg-gray-dark/40 invisible fixed inset-0 z-9999 hidden size-0 opacity-0',
            isOpenSidebar &&
              'visible block size-full opacity-100 xl:invisible xl:hidden xl:size-0 xl:opacity-0'
          )}
        />
      </div>
    </>
  )
}
