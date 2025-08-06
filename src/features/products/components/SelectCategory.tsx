'use client'
import useCreateCategory from '@/features/categories/hooks/useCreateCategory'
import useGetCategories from '@/features/categories/hooks/useGetCategories'
import { OptionType } from '@/types'
import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { MultiValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ICreateBookSchemaType } from '../schema'

interface IProps {
  error?: string
  formsetValue: UseFormSetValue<ICreateBookSchemaType>
  isSuccess: boolean
  initialValue?: MultiValue<OptionType>
}

export default function SelectCategory({ formsetValue, error, isSuccess, initialValue }: IProps) {
  const {
    data: categories,
    refetch,
    isLoading,
  } = useGetCategories({ responseType: true, options: { enabled: false } })
  const [value, setValue] = useState<MultiValue<OptionType> | null>(initialValue ?? null)
  const { mutateAsync, isPending } = useCreateCategory()

  const categoryOptions = categories?.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }))

  const createCategory = async (newLabel: string) => {
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
    formsetValue('categoryIds', newValueUseForm)
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
        noOptionsMessage={() => 'دسته بندی ای وجود ندارد'}
        isClearable
        isDisabled={isPending}
        isLoading={isLoading || isPending}
        options={categoryOptions}
        onFocus={async () => await refetch()}
        onCreateOption={createCategory}
        onChange={(newValue) => handleChange(newValue)}
        value={value}
        placeholder={isPending ? 'در حال ایجاد...' : 'افزودن یا ایجاد دسته بندی'}
        formatCreateLabel={(value: string) => `ایجاد "${value}"`}
      />
      {!!error && <p className="text-error-500 mt-1.5 text-xs">{error}</p>}
    </>
  )
}
