import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CreateProductForm from '@/app/(app)/products/_components/CreateProductForm'

export default function AddProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />

      <CreateProductForm />
    </div>
  )
}
