'use client'
import * as animationData from '@/animations/girl-with-books.json'
import GridShape from '@/components/common/GridShape'
import ThemeTogglerTwo from '@/components/common/ThemeTogglerTwo'
import { useLottie } from 'lottie-react'

import { ThemeProvider } from '@/context/ThemeContext'
import { ILayout } from '@/types'

export default function AuthLayout({ children }: ILayout) {
  const defaultOptions = {
    animationData: animationData,
    loop: false,
  }

  const { View } = useLottie(defaultOptions)
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
          <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
            <div className="relative z-1 flex items-center justify-center">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="w-72">{View}</div>
            </div>
          </div>
          <div className="fixed end-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}
