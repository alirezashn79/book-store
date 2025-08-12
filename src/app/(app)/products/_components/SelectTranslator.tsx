'use client'
import useCreateTranslator from '@/features/translators/hooks/useCreateTranslator'
import useGetTranslators from '@/features/translators/hooks/useGetTranslators'
import { OptionType } from '@/types'
import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { MultiValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ICreateBookSchemaType } from '../_schemas'
import { CircleAlert } from 'lucide-react'

interface IProps {
  error?: string
  formsetValue: UseFormSetValue<ICreateBookSchemaType>
  isSuccess: boolean
  initialValue?: MultiValue<OptionType>
}

export default function SelectTranslator({ formsetValue, error, isSuccess, initialValue }: IProps) {
  const {
    data: translators,
    refetch,
    isLoading,
  } = useGetTranslators({ responseType: true, options: { enabled: false } })
  const [value, setValue] = useState<MultiValue<OptionType> | null>(initialValue ?? null)
  const { mutateAsync, isPending } = useCreateTranslator()

  const translatorsOptions = translators?.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }))

  const createTranslator = async (newLabel: string) => {
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
    console.log(newValueUseForm)
    formsetValue('translatorIds', newValueUseForm)
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
        isClearable
        isDisabled={isPending}
        isLoading={isLoading || isPending}
        options={translatorsOptions}
        onFocus={async () => await refetch()}
        onCreateOption={createTranslator}
        onChange={(newValue) => handleChange(newValue)}
        value={value}
        placeholder={isPending ? 'در حال ایجاد...' : 'افزودن یا ایجاد نویسنده'}
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
