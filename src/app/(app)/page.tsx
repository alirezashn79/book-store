import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart'
import RecentOrders from '@/components/ecommerce/RecentOrders'
import RecentProducts from '@/components/ecommerce/RecentProducts'
import StatisticsChart from '@/components/ecommerce/StatisticsChart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Home for TailAdmin Dashboard Template',
}

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <RecentProducts />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  )
}
