import PageBreadcrumb from '@/components/common/PageBreadCrumb'
const MediaSelector = dynamic(() => import('@/components/mediaSelector/MediaSelector'))
import CreateProductForm from '@/features/products/components/CreateProductForm'
import dynamic from 'next/dynamic'

export default function AddProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />
      <MediaSelector />
      <CreateProductForm />
    </div>
  )
}
