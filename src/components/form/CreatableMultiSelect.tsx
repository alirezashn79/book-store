'use client'

import React, { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { CreatableProps } from 'react-select/creatable'
import { MultiValue } from 'react-select'
const CreatableSelect = dynamic<CreatableProps<OptionType, true, never>>(
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

interface CreatableSelectProps
  extends Omit<CreatableProps<OptionType, true, never>, 'value' | 'onChange'> {
  fetchOptions: () => Promise<OptionType[]>
  createOption: (label: string) => Promise<OptionType>
  placeholder?: string
  value: OptionType[]
  onChange: (value: OptionType[]) => void
}

const CreatableMultiSelectComponent = ({
  fetchOptions,
  createOption,
  placeholder = 'موضوعات را انتخاب یا ایجاد کنید',
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
        onChange([...value, newOption])
      } catch (error) {
        console.error('Error creating option:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [createOption, value, onChange]
  )

  const handleChange = useCallback(
    (newValue: OptionType[]) => {
      onChange(newValue)
    },
    [onChange]
  )

  return (
    <CreatableSelect
      isRtl
      isMulti
      classNamePrefix="react-select"
      className="react-select-container"
      loadingMessage={() => (
        <div className="mx-auto my-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
      )}
      closeMenuOnSelect={false}
      isClearable
      isLoading={isLoading}
      options={options}
      onFocus={handleFocus}
      onCreateOption={handleCreate}
      onChange={handleChange}
      value={value}
      placeholder={hasFetched && isLoading ? 'در حال ایجاد' : placeholder}
      formatCreateLabel={(val: string) => `ایجاد "${val}"`}
      {...props}
    />
  )
}

export default CreatableMultiSelectComponent
