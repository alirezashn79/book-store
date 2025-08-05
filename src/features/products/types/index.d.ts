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
