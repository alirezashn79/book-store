'use client'

import dynamic from 'next/dynamic'
import { Props as ReactSelectProps } from 'react-select'
const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto my-4 size-6 animate-spin rounded-full border-t-2 border-blue-500" />
  ),
})

export interface OptionType {
  value: string
  label: string
}

const Select = (props: ReactSelectProps<OptionType, boolean>) => {
  return (
    <ReactSelect
      isRtl
      noOptionsMessage={() => <p>وجود ندارد</p>}
      classNamePrefix="react-select"
      className="react-select-container"
      loadingMessage={() => (
        <div className="mx-auto my-4 size-5 animate-spin rounded-full border-t-2 border-blue-500" />
      )}
      {...(props as ReactSelectProps)}
    />
  )
}

export default Select
