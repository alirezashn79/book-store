import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { endpoints } from '@/endpoints'
import ProductList from '@/features/products/components/ProductList'
import { IGetBooks } from '@/features/products/types'
import { ApiResponse, PaginatedResponse } from '@/types/api'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search, page } = await searchParams

  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${endpoints.books.default}`)
  if (search) url.searchParams.set('search', search)
  if (page) url.searchParams.set('page', page)

  const data = await fetch(url, {
    next: { revalidate: 60, tags: ['books'] },
  })
  const dataJson = (await data.json()) as ApiResponse<PaginatedResponse<IGetBooks>>

  console.log(dataJson)

  if (!dataJson.success) throw new Error('error to fetch books')

  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />
      <ProductList
        data={dataJson.data}
        initialSearch={search || ''}
        initialPage={parseInt(page || '1')}
      />
    </div>
  )
}
