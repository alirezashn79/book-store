import React, { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface LabelProps {
  htmlFor?: string
  children: ReactNode
  className?: string
  optional?: boolean
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, optional = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        // Default classes that apply by default
        'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',

        // User-defined className that can override the default margin
        className
      )}
    >
      {children}
      {optional ? (
        <span className="px-1 text-xs text-gray-400 dark:text-gray-600">(اختیاری)</span>
      ) : (
        <span className="text-error-500 px-1">*</span>
      )}
    </label>
  )
}

export default Label
