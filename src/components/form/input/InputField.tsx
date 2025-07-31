import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

interface CustomInputProps {
  success?: boolean
  error?: string
  hint?: ReactNode
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & CustomInputProps

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ success = false, error, hint, className = '', ...rest }, ref) => {
    // کلاس‌های پایه
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`

    if (rest.disabled) {
      inputClasses +=
        ' text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
    } else if (!!error) {
      inputClasses +=
        ' text-error-800 border-error-500 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500'
    } else if (success) {
      inputClasses +=
        ' text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500'
    } else {
      inputClasses +=
        ' bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800'
    }

    return (
      <div className="relative">
        <input
          ref={ref}
          className={inputClasses}
          {...rest} // این‌جا تمام props استاندارد (type, name, onChange و …) اعمال می‌شوند
        />

        {!!error && (
          <p
            className={`mt-1.5 text-xs ${
              !!error ? 'text-error-500' : success ? 'text-success-500' : 'text-gray-500'
            }`}
          >
            {error}
          </p>
        )}

        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              !!error ? 'text-error-500' : success ? 'text-success-500' : 'text-gray-500'
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
