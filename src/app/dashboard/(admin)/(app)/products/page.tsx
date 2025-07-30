'use client'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicTableOne from '@/components/tables/BasicTableOne'
import Button from '@/components/ui/button/Button'
import { PlusIcon } from '@/icons'
import { api } from '@/libs/api'
import Link from 'next/link'
import { useCallback } from 'react'

export default function ProductsPage() {
  const test = async () => {
    const get = await api.get('books').json()
    console.log(get)
  }
  const addLinkBtn = useCallback(
    () => (
      <Link href="/dashboard/products/add">
        <Button endIcon={<PlusIcon />}>افزودن</Button>
      </Link>
    ),
    []
  )

  return (
    <div>
      <PageBreadcrumb pageTitle="محصولات" />
      <button onClick={test}>test</button>
      <ComponentCard button={addLinkBtn()} title="Basic Table 1">
        <BasicTableOne />
      </ComponentCard>
    </div>
  )
}
