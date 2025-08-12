import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'
import localFont from 'next/font/local'
import ReactQueryProvider from '@/providers/reactQueryProvider'
import { Toaster } from 'react-hot-toast'
import { SidebarProvider } from '@/context/SidebarContext'
const dana = localFont({
  src: [
    {
      path: '../assets/fonts/dana/DanaFaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/dana/DanaFaNum-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/dana/DanaFaNum-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--ffont-dana',
  display: 'swap',
})

const morabba = localFont({
  src: [
    {
      path: '../assets/fonts/morabba/Morabba-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/morabba/Morabba-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/morabba/Morabba-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--ffont-morabba',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${dana.variable} ${morabba.variable}`}>
      <body className={`${dana.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ReactQueryProvider>
            <SidebarProvider>{children}</SidebarProvider>
            <Toaster
              containerStyle={{
                zIndex: 999999999999999,
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
