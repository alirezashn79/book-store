import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CreateProductForm from '@/features/products/components/CreateProductForm'

export default function AddProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />

      <CreateProductForm />
    </div>
  )
}
