import React, { forwardRef } from 'react'

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> {
  hint?: string
  error?: string
  value?: string | number | readonly string[] | null | undefined // 👈 اضافه کردن null
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder = 'Enter your message',
      rows = 3,
      className = '',
      disabled = false,
      error,
      hint = '',
      value,
      ...rest
    },
    ref
  ) => {
    let textareaClasses = `w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`

    if (disabled) {
      textareaClasses += `bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`
    } else if (!!error) {
      textareaClasses += ` text-error-800 border-error-500 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`
    } else {
      textareaClasses += ` bg-transparent <text-gray-8></text-gray-8>00 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`
    }

    return (
      <div className="relative">
        <textarea
          ref={ref} // 👈 اضافه کردن ref
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={textareaClasses}
          value={value ?? ''} // 👈 تبدیل null به string خالی
          {...rest}
        />
        {!!error && (
          <p className="text-error-500 mt-2 text-sm">
            {error} {/* 👈 اصلاح: نمایش error به جای hint */}
          </p>
        )}
        {hint &&
          !error && ( // 👈 فقط وقتی error نداریم hint نشان بده
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
          )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea' // 👈 اضافه کردن displayName

export default TextArea
