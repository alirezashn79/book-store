'use client'
import ComponentCard from '@/components/common/ComponentCard'
import Pagination from '@/components/common/Pagination'
import Input from '@/components/form/input/InputField'
import Alert from '@/components/ui/alert/Alert'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import usePaginatedSearch from '@/hooks/usePaginationSearch'
import { PlusIcon } from '@/icons'
import { PaginatedResponse } from '@/types/api'
import { BookOpenText, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { revalidateBooksAction } from '../_actions/revalidateBooks'
import useDeleteBook from '../_hooks/useDeleteBook'
import { IGetBooks } from '../_types'

interface IProps {
  data: PaginatedResponse<IGetBooks>
  initialSearch?: string
  initialPage?: number
}

export default function ProductList({ data: books, initialSearch = '', initialPage = 1 }: IProps) {
  const [deleteItem, setDeleteItem] = useState<IGetBooks | null>(null)
  const { mutateAsync: deleteBook, isPending } = useDeleteBook()
  const router = useRouter()

  const { page, search, setSearch, handlePageChange, searchValidation } = usePaginatedSearch({
    baseUrl: '/products',
    initialSearch,
    initialPage,
  })

  const handleOpenErrorAlert = (item: IGetBooks) => {
    setDeleteItem(item)
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async () => {
    if (!deleteItem) return

    await deleteBook(
      {
        id: deleteItem.id,
      },
      {
        onSuccess: async () => {
          await revalidateBooksAction()
          setDeleteItem(null)
        },
      }
    )
  }

  const handleNavigateToEditPage = (id: string) => {
    router.push(`/products/${id}/edit`)
  }

  return (
    <div className="space-y-4">
      {deleteItem && (
        <Alert
          variant="error"
          title={`محصول " ${deleteItem.title} " حذف شود؟`}
          message="حذف دائمی است!"
          isConfirm
          onCancel={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          isLoading={isPending}
        />
      )}

      <ComponentCard
        button={
          <Link href="/products/add">
            <Button endIcon={<PlusIcon />}>افزودن</Button>
          </Link>
        }
        title="لیست محصولات"
      >
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="برای جستجو حداقل 2 کاراکتر وارد کنید..."
            className="md:!w-1/2 lg:!w-1/3 xl:!w-1/4"
          />

          {searchValidation.showMinLengthError && (
            <p className="mt-2 text-sm text-amber-600">حداقل 2 کاراکتر وارد کنید</p>
          )}

          {searchValidation.showSearching && (
            <p className="mt-2 text-sm text-gray-500">در حال جستجو...</p>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      محصول
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      موجودی
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      دسته بندی
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      وضعیت
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      قیمت
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      عملیات
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {books?.data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                        {search
                          ? `هیچ محصولی با عبارت "${search}" یافت نشد`
                          : 'هیچ محصولی یافت نشد'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    books?.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-5 py-4 text-start sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-full">
                              {item.images.length > 0 ? (
                                <Image
                                  height={40}
                                  width={40}
                                  src={item.images[0].url}
                                  placeholder="blur"
                                  blurDataURL={item.images[0].blurDataURL}
                                  className="size-full object-cover"
                                  alt={item.title}
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center bg-gray-300 text-white dark:bg-gray-950">
                                  <BookOpenText />
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="text-theme-sm block font-medium text-gray-800 dark:text-white/90">
                                {item.title}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm mx-auto px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                          {item.stock}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          <div className="flex flex-wrap items-center justify-center gap-1">
                            {item.categories
                              ? item?.categories?.map((it) => (
                                  <Badge size="sm" color="dark" key={it.id + '-category'}>
                                    {it.name}
                                  </Badge>
                                ))
                              : '-----'}
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                          <Badge size="sm" color={item.isActive ? 'success' : 'error'}>
                            {item.isActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                          {item.price?.toLocaleString('fa-IR')} تومان
                        </TableCell>
                        <TableCell className="text-theme-sm mt-4 flex items-center justify-center gap-3 px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                          <button
                            onClick={() => handleOpenErrorAlert(item)}
                            className="hover:text-error-500"
                          >
                            <Trash2 className="size-4" />
                          </button>
                          <button
                            onClick={() => handleNavigateToEditPage(item.id)}
                            className="hover:text-brand-400"
                          >
                            <Edit2 className="size-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {books && books.meta.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={books.meta.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </ComponentCard>
    </div>
  )
}
