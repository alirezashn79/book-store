'use client'
import Button from '@/components/ui/button/Button'
import SideBar from '@/app/(app)/media/_components/SideBar'
import useContextMenu from '@/hooks/useContextMenu'
import { useUppyStore } from '@/stores/uppyStore'
import { cn } from '@/utils/cn'
import { PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import ContextMenu from '../../../../layout/contextMenu'
import DeleteMedia from '../_hooks/DeleteMedia'
import useLoadMedia from '../_hooks/useLoadMedia'
import useRemoveMedia from '../_hooks/useRemoveMedia'
import MediaUploader from './mediaUploader'
import { useUppyManager } from '@/hooks/useUppyManager'

export default function MedisList() {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  useUppyManager()
  const [isDelete, setIsDelete] = useState(false)
  const mediaContainer = useRef<HTMLDivElement>(null)
  const isUploading = useUppyStore((s) => s.isUploading)
  const {
    ref,
    getMedia: { data: media, isFetchingNextPage, isRefetching, isPending },
  } = useLoadMedia()

  const { onRightClick, itemId } = useContextMenu()
  const { isPending: isDeleting } = useRemoveMedia()

  const selectedItem = useMemo(
    () => media?.pages.flatMap((group) => group.data).find((item) => item.id === itemId),
    [itemId]
  )

  const mediaList = useMemo(() => media && media.pages.flatMap((group) => group.data), [media])
  const total = useMemo(() => media && media.pages.flatMap((group) => group.meta)[0].total, [media])

  return (
    <>
      <DeleteMedia isDelete={isDelete} setIsDelete={setIsDelete} />
      {isRefetching && <p className="my-4 animate-pulse text-center">در حال بروزرسانی...</p>}
      {isUploading && <p className="my-4 animate-pulse text-center">در حال آپلود...</p>}
      {total && !isRefetching && !isUploading && (
        <p className="my-4 text-center">تعداد کل ({total})</p>
      )}
      <div
        ref={mediaContainer}
        className={cn(
          'relative flex w-full overflow-x-hidden xl:h-[calc(100vh-170px)]',
          isOpenSidebar && 'lg:gap-4'
        )}
      >
        <div className={cn('w-full transition-all xl:w-full', isOpenSidebar && 'xl:w-3/4')}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <div className="col-span-2 row-span-2 min-h-80 md:col-span-3 lg:col-span-2 lg:h-full">
              <MediaUploader />
            </div>
            {mediaList?.map((mediaItem) => (
              <div
                onContextMenu={(e) => onRightClick(e, mediaItem.id)}
                key={mediaItem.id}
                className={cn(
                  'h-40 overflow-hidden rounded-md bg-gray-100 transition-transform dark:bg-gray-700',
                  (isDeleting || isRefetching) &&
                    itemId === mediaItem.id &&
                    'scale-95 animate-pulse'
                )}
              >
                {mediaItem.mimeType.includes('image/') ? (
                  <Image
                    height={160}
                    width={160}
                    placeholder="blur"
                    blurDataURL={mediaItem.blurDataURL}
                    src={mediaItem.url}
                    alt={mediaItem.fileName}
                    className="size-full object-cover"
                  />
                ) : mediaItem.mimeType.includes('video/') ? (
                  <div className="relative size-full">
                    <video
                      src={mediaItem.url}
                      muted
                      controls={false}
                      preload="metadata"
                      className="pointer-events-none h-full w-full object-cover"
                    />

                    <div className="text-brand-100 absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          onRightClick(e, mediaItem.id)
                          setIsOpenSidebar(true)
                        }}
                      >
                        <PlayCircle className="size-10" />
                      </button>
                    </div>
                  </div>
                ) : (
                  mediaItem.mimeType.includes('/pdf') && (
                    <div className="flex size-full items-center justify-center">
                      <div className="border-error-600 bg-error-25 dark:bg-error-950 rounded-lg border-2 p-2">
                        <code className="text-error-600 text-6xl font-bold">PDF</code>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}

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

        <SideBar title="جزییات" isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar}>
          {selectedItem && (
            <>
              <div className="dark:bg-gray-dark h-56 max-h-fit rounded-md bg-gray-100">
                {selectedItem.mimeType.includes('image/') ? (
                  <Image
                    height={160}
                    width={160}
                    placeholder="blur"
                    blurDataURL={selectedItem.blurDataURL}
                    src={selectedItem!.url}
                    alt={selectedItem!.fileName}
                    className="size-full object-contain"
                  />
                ) : selectedItem.mimeType.includes('video/') ? (
                  <video
                    controls
                    autoPlay
                    src={selectedItem.url}
                    className="h-full w-full object-contain"
                  />
                ) : selectedItem.mimeType.includes('/pdf') ? (
                  <div className="flex size-full items-center justify-center">
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (selectedItem) window.open(selectedItem.url, '_blank')
                      }}
                    >
                      مشاهده PDF
                    </Button>
                  </div>
                ) : null}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="font-bold">نام فایل: </span>
                  <span>{selectedItem.fileName}</span>
                </li>
                <li>
                  <span className="font-bold">لینک فایل: </span>
                  <Link
                    target="_blank"
                    className="text-brand-500 dark:text-brand-300 underline"
                    href={selectedItem.url}
                  >
                    لینک
                  </Link>
                </li>
              </ul>
            </>
          )}
        </SideBar>
      </div>
      <ContextMenu
        items={[
          {
            title: 'باز کردن در تب جدید',
            onClick: () => {
              window.open(selectedItem?.url, '_blank')
            },
          },
          {
            title: 'حذف',
            onClick: () => {
              setIsDelete(true)
            },
          },
          {
            title: 'جزییات',
            onClick: () => {
              setIsOpenSidebar(true)
            },
          },
        ]}
      />
    </>
  )
}
