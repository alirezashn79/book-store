'use client'
import useCreatePublisher from '@/features/publishers/hooks/useCreatePublisher'
import useGetPublishers from '@/features/publishers/hooks/useGetPublishers'
import { OptionType } from '@/types'
import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { SingleValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ICreateBookSchemaType } from '../schema'

interface IProps {
  error?: string
  formsetValue: UseFormSetValue<ICreateBookSchemaType>
  isSuccess: boolean
  initialValue?: SingleValue<OptionType>
}

export default function SelectPublisher({ formsetValue, error, isSuccess, initialValue }: IProps) {
  const {
    data: Publishers,
    refetch,
    isLoading,
  } = useGetPublishers({ responseType: true, options: { enabled: false } })
  const [value, setValue] = useState<SingleValue<OptionType> | null>(initialValue ?? null)
  const { mutateAsync, isPending } = useCreatePublisher()

  const PublisherOptions = Publishers?.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }))

  const createPublisher = async (newLabel: string) => {
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
          setValue({ label: name, value: String(id) })
        },
      }
    )
  }

  const handleChange = (newValue: SingleValue<OptionType>) => {
    setValue(newValue)

    formsetValue('publisherId', Number(newValue?.value))
  }

  useEffect(() => {
    if (isSuccess) setValue(null)
  }, [isSuccess])

  return (
    <>
      <CreatableSelect
        isRtl
        classNamePrefix="react-select"
        className="react-select-container"
        loadingMessage={() => (
          <div className="mx-auto my-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
        )}
        noOptionsMessage={() => 'ناشری وجود ندارد'}
        isClearable
        isDisabled={isPending}
        isLoading={isLoading || isPending}
        options={PublisherOptions}
        onFocus={async () => await refetch()}
        onCreateOption={createPublisher}
        onChange={(newValue) => handleChange(newValue)}
        value={value}
        placeholder={isPending ? 'در حال ایجاد...' : 'افزودن یا ایجاد ناشر'}
        formatCreateLabel={(value: string) => `ایجاد "${value}"`}
      />
      {!!error && <p className="text-error-500 mt-1.5 text-xs">{error}</p>}
    </>
  )
}
