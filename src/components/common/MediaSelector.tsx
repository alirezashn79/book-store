'use client'

import MediaUploader from '@/app/(app)/media/_components/mediaUploader'
import useLoadMedia from '@/app/(app)/media/_hooks/useLoadMedia'
import { useUppyStore } from '@/stores/uppyStore'
import { cn } from '@/utils/cn'
import { CheckCircle, Maximize2, Minimize2, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Path, PathValue, UseFormSetValue } from 'react-hook-form'
import Overlay from './Overlay'
import Button from '../ui/button/Button'

interface IProps<T extends object> {
  count?: number
  values: string[]
  setValue: UseFormSetValue<T>
  field: Path<T>
  error?: string
}

export default function MediaSelector<T extends object>({
  count = 1,
  values,
  setValue,
  field,
  error,
}: IProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const isUploading = useUppyStore((s) => s.isUploading)
  const [isLast, setIsLast] = useState(false)
  const [isFull, setIsFull] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const {
    ref,
    getMedia: { data: media, isFetchingNextPage, isPending, isRefetching },
  } = useLoadMedia({ enabled: true })

  const mediaList = useMemo(
    () =>
      media &&
      media.pages.flatMap((group) => group.data.filter((item) => item.mimeType.includes('image'))),
    [media]
  )

  const handleSelect = (id: string) => {
    const tmp = values.slice()
    if (tmp.includes(id)) {
      const filtered = tmp.filter((item) => item !== id)
      setValue(field, filtered as PathValue<T, Path<T>>)
      return
    }
    if (values.length >= count) {
      if (isLast) {
        tmp.shift()
        tmp.unshift(id)
        setIsLast(false)
      } else {
        tmp.pop()
        tmp.push(id)
        setIsLast(true)
      }
      setValue(field, tmp as PathValue<T, Path<T>>)
      return
    }
    tmp.push(id)
    setValue(field, tmp as PathValue<T, Path<T>>)
  }

  const reset = () => {
    setValue(field, [] as PathValue<T, Path<T>>)
  }

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  return (
    <>
      <button
        type="button"
        className={cn(
          'shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30',
          error &&
            'text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500'
        )}
        onClick={toggle}
      >
        {values.length > 0
          ? `${values.length} انتخاب شده`
          : error
            ? 'انتخاب حداقل 1 عکس اجباری است'
            : 'انتخاب رسانه'}
      </button>

      {!!error && <p className="text-error-500 mt-1.5 text-xs">{error}</p>}

      {isOpen && (
        <div
          className={cn(
            'fixed start-0 end-0 bottom-0 z-999999 rounded-t-2xl bg-white p-4 shadow-inner dark:bg-gray-950',
            isFull && 'top-0 rounded-t-none'
          )}
        >
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(false)}>
              <X className="size-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={() => setIsFull((prev) => !prev)}>
              {isFull ? (
                <Minimize2 className="size-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Maximize2 className="size-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between py-4">
            <h3>انتخاب رسانه</h3>
            <div className="flex items-center gap-x-2">
              {values.length > 0 && (
                <Button onClick={reset} variant="outline" className="h-10 min-w-20">
                  لغو
                </Button>
              )}
              <Button onClick={() => setIsOpen(false)} variant="primary" className="h-10 min-w-20">
                انتخاب
              </Button>
            </div>
          </div>

          {isRefetching && <p className="my-4 animate-pulse text-center">در حال بروزرسانی...</p>}
          {isUploading && <p className="my-4 animate-pulse text-center">در حال آپلود...</p>}
          {!isRefetching && !isUploading && (
            <p className="my-4 text-center">
              تعداد مجاز انتخاب: ({count}) - انتخاب شده: ({values.length})
            </p>
          )}

          <div className={cn('h-[22rem] overflow-y-auto', isFull && 'h-full pb-40')}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <div className="col-span-2 row-span-2 min-h-80 md:col-span-3 lg:col-span-2 lg:h-full">
                <MediaUploader />
              </div>
              {mediaList?.map((mediaItem) => (
                <div
                  key={mediaItem.id}
                  className={cn(
                    'relative h-40 overflow-hidden rounded-md bg-gray-100 transition-transform dark:bg-gray-700'
                  )}
                  onClick={() => handleSelect(mediaItem.id)}
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
                    <video
                      src={mediaItem.url}
                      muted
                      controls={false}
                      preload="metadata"
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  ) : (
                    mediaItem.mimeType.includes('/pdf') && (
                      <div className="flex size-full items-center justify-center">
                        <div className="border-error-600 bg-error-25 dark:bg-error-950 rounded-lg border-2 p-2">
                          <code className="text-error-600 text-6xl font-bold">PDF</code>
                        </div>
                      </div>
                    )
                  )}

                  {values.includes(mediaItem.id) && (
                    <div className="bg-brand-500/25 border-brand-500 absolute inset-0 flex items-center justify-center rounded-md border-2">
                      <CheckCircle className="size-16 text-white" />
                    </div>
                  )}
                </div>
              ))}

              <div ref={ref} className="col-span-2 h-0.5 w-full md:col-span-3 xl:col-span-4" />
              {isFetchingNextPage && (
                <div className="col-span-2 flex h-2 w-full animate-pulse justify-center md:col-span-3 xl:col-span-6">
                  در حال بارگذاری...
                </div>
              )}

              {isPending && (
                <div className="col-span-2 flex h-40 w-full justify-center md:col-span-3 xl:col-span-6">
                  <div className="size-8 animate-spin rounded-full border-t-2 border-blue-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Overlay isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
