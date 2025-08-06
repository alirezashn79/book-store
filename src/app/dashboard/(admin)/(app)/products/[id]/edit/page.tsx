import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import UpdateProductForm from '@/features/products/components/UpdateProductForm'
import { IGetSingleBook } from '@/features/products/types'
import { ApiResponse } from '@/types/api'
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id.toString()}`
  const response = await fetch(url, {
    next: {
      tags: ['book'],
    },
  })
  const json: ApiResponse<IGetSingleBook> = await response.json()

  if (!response.ok || !json.success) throw new Error('خطا در بارگذاری محصول')
  const book = json.data
  return (
    <div>
      <PageBreadcrumb pageTitle={`محصول  "${book.title}"`} />

      <UpdateProductForm id={Number(id)} initialData={book} />
    </div>
  )
}
