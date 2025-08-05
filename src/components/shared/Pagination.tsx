import { cn } from '@/utils/cn'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const CustomPagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
  const renderPageButtons = () => {
    let startPage = Math.max(currentPage - 1, 1)
    let endPage = startPage + 2
    if (endPage > lastPage) {
      endPage = lastPage
      startPage = Math.max(endPage - 2, 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={currentPage === p}
            className={cn(
              'dark:bg-boxdark rounded bg-white px-4 py-2 shadow',
              currentPage === p && 'bg-primary dark:bg-primary text-white'
            )}
          >
            {p}
          </button>
        ))}
        {endPage < lastPage && <span className="px-2">...</span>}
        {endPage < lastPage && (
          <button
            onClick={() => onPageChange(lastPage)}
            className="dark:bg-boxdark rounded bg-white px-4 py-2 shadow"
          >
            {lastPage}
          </button>
        )}
      </>
    )
  }

  return (
    <div className="mt-6 flex justify-end text-sm">
      <div className="ms-auto flex gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="dark:bg-boxdark rounded bg-white p-2 shadow disabled:opacity-50"
          >
            صفحه قبلی
          </button>

          {renderPageButtons()}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="dark:bg-boxdark rounded bg-white p-2 shadow disabled:opacity-50"
          >
            صفحه بعدی
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomPagination
