import { SidebarProvider } from '@/context/SidebarContext'
import { ILayout } from '@/types'

export default function DashboardLayout({children} : ILayout) {
  return (
             <SidebarProvider>{children}</SidebarProvider>
  )
}
