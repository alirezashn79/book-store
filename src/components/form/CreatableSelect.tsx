'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { CreatableProps } from 'react-select/creatable'
const CreatableSelect = dynamic<CreatableProps<OptionType, false, never>>(
  () => import('react-select/creatable').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto mt-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
    ),
  }
)

export interface OptionType {
  value: string
  label: string
}

interface CreatableSelectProps extends CreatableProps<OptionType, false, never> {
  fetchOptions: () => Promise<OptionType[]>
  createOption: (label: string) => Promise<OptionType>
  placeholder?: string
  value?: OptionType | null
  onChange?: (value: OptionType | null) => void
}

const CreatableSelectComponent = ({
  fetchOptions,
  createOption,
  placeholder = 'دسته‌بندی را انتخاب یا ایجاد کنید',
  value,
  onChange,
  ...props
}: CreatableSelectProps) => {
  const [options, setOptions] = useState<OptionType[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFocus = useCallback(async () => {
    if (!hasFetched) {
      setIsLoading(true)
      try {
        const data = await fetchOptions()
        setOptions(data)
        setHasFetched(true)
      } catch (error) {
        console.error('Error fetching options:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [fetchOptions, hasFetched])

  const handleCreate = useCallback(
    async (inputValue: string) => {
      setIsLoading(true)
      try {
        const newOption = await createOption(inputValue)
        setOptions((prev) => [...prev, newOption])
        onChange?.(newOption) // اطلاع به hook form
      } catch (error) {
        console.error('Error creating option:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [createOption, onChange]
  )

  const handleChange = useCallback(
    (newValue: OptionType | null) => {
      onChange?.(newValue)
    },
    [onChange]
  )

  return (
    <CreatableSelect
      isRtl
      classNamePrefix="react-select"
      className="react-select-container"
      loadingMessage={() => (
        <div className="mx-auto my-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
      )}
      isClearable
      isLoading={isLoading}
      options={options}
      onFocus={handleFocus}
      onCreateOption={handleCreate}
      onChange={handleChange}
      value={value}
      placeholder={hasFetched && isLoading ? 'در حال ایجاد' : placeholder}
      formatCreateLabel={(value: string) => `ایجاد "${value}"`}
      {...props}
    />
  )
}

export default CreatableSelectComponent
