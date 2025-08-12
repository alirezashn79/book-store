'use client'
import useCreateAuthor from '@/features/authors/hooks/useCreateAuthor'
import useGetAuthors from '@/features/authors/hooks/useGetAuthors'
import { OptionType } from '@/types'
import { CircleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { MultiValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ICreateBookSchemaType } from '../_schemas'

interface IProps {
  error?: string
  formsetValue: UseFormSetValue<ICreateBookSchemaType>
  isSuccess: boolean
  initialValue?: MultiValue<OptionType>
}

export default function SelectAuthor({ formsetValue, error, isSuccess, initialValue }: IProps) {
  const {
    data: authors,
    refetch,
    isLoading,
  } = useGetAuthors({ responseType: true, options: { enabled: false } })
  const [value, setValue] = useState<MultiValue<OptionType> | null>(initialValue ?? null)
  const { mutateAsync, isPending } = useCreateAuthor()

  const authorsOptions = authors?.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }))

  const createAuthor = async (newLabel: string) => {
    await mutateAsync(
      {
        name: newLabel,
      },
      {
        onSuccess: async (e) => {
          await refetch()
          const {
            data: { id, name },
          } = (await e.json()) as { data: { id: number; name: string } }
          setValue((prev) => [...(prev ?? []), { label: name, value: String(id) }])
        },
      }
    )
  }

  const handleChange = (newValue: MultiValue<OptionType>) => {
    setValue(newValue)
    const newValueUseForm = newValue.map((item) => Number(item.value))
    formsetValue('authorIds', newValueUseForm)
  }

  useEffect(() => {
    if (isSuccess) setValue([])
  }, [isSuccess])

  return (
    <>
      <CreatableSelect
        isRtl
        isMulti
        classNamePrefix="react-select"
        className="react-select-container"
        loadingMessage={() => (
          <div className="mx-auto my-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
        )}
        noOptionsMessage={() => 'نویسنده ای وجود ندارد'}
        isClearable
        isDisabled={isPending}
        isLoading={isLoading || isPending}
        options={authorsOptions}
        onFocus={async () => await refetch()}
        onCreateOption={createAuthor}
        onChange={(newValue) => handleChange(newValue)}
        value={value}
        placeholder={isPending ? 'در حال ایجاد...' : 'افزودن یا ایجاد مترجم'}
        formatCreateLabel={(value: string) => `ایجاد "${value}"`}
      />
      <div className="text-warning-500 mt-0.5 flex items-center gap-1">
        <CircleAlert className="size-3.5" />
        <p className="text-xs">اگر آیتمی نبود می توانید آن را بسازید</p>
      </div>
      {!!error && <p className="text-error-500 mt-1.5 text-xs">{error}</p>}
    </>
  )
}
