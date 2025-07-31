import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import dynamic from 'next/dynamic'
const MediaList = dynamic(() => import('@/features/media/components/mediaList'))

export default function MediaPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="مدیا" />

      <MediaList />
    </div>
  )
}
