'use client'
import Alert from '@/components/ui/alert/Alert'
import { useRefresh } from '@/hooks/useRefresh'
import { useContextMenuStore } from '@/stores/contextMenuStore'
import { Dispatch, SetStateAction } from 'react'
import useRemoveMedia from './useRemoveMedia'

interface IProps {
  isDelete: boolean
  setIsDelete: Dispatch<SetStateAction<boolean>>
}

export default function DeleteMedia({ isDelete, setIsDelete }: IProps) {
  const { itemId, setClear } = useContextMenuStore()
  const { mutateAsync: deleteMedia, isPending: isDeleting } = useRemoveMedia()
  const refreshMedia = useRefresh(['media'])

  if (!isDelete || !itemId) return null

  return (
    <div className="mb-2 transition-all">
      <Alert
        variant="warning"
        title={`فایل حذف شود؟`}
        isConfirm
        onConfirm={async () => {
          if (itemId) {
            deleteMedia(
              { id: itemId as string },
              {
                onSuccess: () => {
                  setIsDelete(false)
                  refreshMedia().then(() => {
                    setClear()
                  })
                },
              }
            )
          }
        }}
        isLoading={isDeleting}
        onCancel={() => setIsDelete(false)}
      />
    </div>
  )
}
