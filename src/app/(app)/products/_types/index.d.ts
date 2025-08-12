export interface IGetBooks {
  id: string
  title: string
  price: number
  images: {
    id: string
    url: string
    blurDataURL?: string
  }[]
  isActive: boolean
  stock: number
  categories: Array<{ id: number; name: string }>
}

interface IBookAuthor {
  id: number
  name: string
}

interface IBookCategory {
  id: number
  name: string
}
interface IBookTopics {
  id: number
  name: string
}

interface IBookTranslator {
  id: number
  name: string
}
interface IBookPublisher {
  id: number
  name: string
}

interface IBookImage {
  id: string
  url: string
  fileName: string
  blurDataURL: true
}

interface IGetSingleBook {
  id: number
  title: string
  description: string
  isbn: string | null
  price: number
  stock: number
  pages: number | null
  pdfUrl: string | null
  format: string | null
  publisherId: number | null
  isActive: boolean | null
  publishYear: string | null
  printEdition: number | null
  language: string | null
  paperType: string | null
  height: number | null
  width: number | null
  weight: number | null
  createdAt: string | null
  updatedAt: string | null
  publisher: IBookPublisher
  authors: IBookAuthor[]
  translators: IBookTranslator[]
  images: IBookImage[]
  categories: IBookCategory[]
  topics: IBookTopics[]
}
