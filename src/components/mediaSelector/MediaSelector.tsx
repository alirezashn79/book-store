'use client'

import MediaUploader from '@/features/media/components/mediaUploader'
import useLoadMedia from '@/features/media/hooks/useLoadMedia'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Overlay from '../common/Overlay'
import Button from '../ui/button/Button'
import { useUppyStore } from '@/stores/uppyStore'
import useMediaSelectorStore from '@/stores/mediaSelectorStore'
import { CheckCircle } from 'lucide-react'

export default function MediaSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const isUploading = useUppyStore((s) => s.isUploading)
  const [isLast, setIsLast] = useState(false)
  const { count, setCount, selectedMedias, setSelectedMedias } = useMediaSelectorStore()

  const toggle = () => setIsOpen((prev) => !prev)
  const {
    ref,
    getMedia: { data: media, isFetchingNextPage, isPending, isRefetching, refetch },
  } = useLoadMedia({ enabled: false })

  const mediaList = useMemo(() => media && media.pages.flatMap((group) => group.data), [media])
  const total = useMemo(() => media && media.pages.flatMap((group) => group.meta)[0].total, [media])

  const handleSelect = (id: string) => {
    const tmp = selectedMedias.slice()
    if (tmp.includes(id)) {
      const filtered = tmp.filter((item) => item !== id)
      setSelectedMedias(filtered)
      return
    }
    if (selectedMedias.length >= count) {
      if (isLast) {
        tmp.shift()
        tmp.unshift(id)
        setIsLast(false)
      } else {
        tmp.pop()
        tmp.push(id)
        setIsLast(true)
      }
      setSelectedMedias(tmp)
      return
    }
    tmp.push(id)
    setSelectedMedias(tmp)
  }

  useEffect(() => {
    if (!isOpen) return
    refetch()
  }, [isOpen])

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
      <Button onClick={toggle} variant={selectedMedias.length > 0 ? 'primary' : 'outline'}>
        {selectedMedias.length > 0 ? `${selectedMedias.length} انتخاب شده` : 'انتخاب رسانه'}
      </Button>

      {isOpen && (
        <div
          className={cn(
            'fixed start-0 end-0 bottom-0 z-999999 rounded-t-2xl bg-white p-4 shadow-inner transition-all dark:bg-gray-950'
          )}
        >
          {isRefetching && <p className="my-4 animate-pulse text-center">در حال بروزرسانی...</p>}
          {isUploading && <p className="my-4 animate-pulse text-center">در حال آپلود...</p>}
          {total && !isRefetching && !isUploading && (
            <p className="my-4 text-center">
              تعداد کل ({total}) - تعداد مجاز انتخاب: ({count}) - انتخاب شده: (
              {selectedMedias.length})
            </p>
          )}
          <div className="py-4">
            <h3>انتخاب رسانه</h3>
          </div>
          <div className="h-[22rem] overflow-y-auto">
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

                  {selectedMedias.includes(mediaItem.id) && (
                    <div className="bg-brand-500/20 absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="size-16" />
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
