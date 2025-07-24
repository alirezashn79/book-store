import Joi from 'joi'

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  translator: Joi.string().allow(null).optional(),
  publisherId: Joi.string().allow(null).optional(),
  publishYear: Joi.number().integer().allow(null).optional(),
  printEdition: Joi.number().integer().allow(null).optional(),
  isbn: Joi.string().allow(null).optional(),
  summary: Joi.string().allow(null, '').optional(),
  language: Joi.string().allow(null).optional(),
  pageCount: Joi.number().integer().allow(null).optional(),
  //   format: Joi.string().valid('HARDCOVER', 'PAPERBACK').allow(null).optional(),
  format: Joi.string().allow(null).optional(),
  //   paperType: Joi.string().valid('GLOSSY', 'MATTE', 'RECYCLED').allow(null).optional(),
  paperType: Joi.string().allow(null).optional(),
  //   coverType: Joi.string().valid('HARDCOVER', 'SOFTBACK').allow(null).optional(),
  coverType: Joi.string().allow(null).optional(),
  weight: Joi.number().integer().allow(null).optional(),
  dimensions: Joi.string().allow(null).optional(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required(),
  thumbnail: Joi.string().allow(null).optional(),
  images: Joi.array().items(Joi.string()).allow(null).optional(),
  categoryId: Joi.string().required(),
  isActive: Joi.boolean().default(true),
  topics: Joi.array().items(Joi.string()).allow(null).optional(),
})

interface IBookAdd {
  title: string
  author: string
  translator?: string | null
  publisherId?: string | null
  publishYear?: number | null
  printEdition?: number | null
  isbn?: string | null
  summary?: string | null
  language?: string | null
  pageCount?: number | null
  format?: string | null
  paperType?: string | null
  coverType?: string | null
  weight?: number | null
  dimensions?: string | null
  price: number
  stock: number
  thumbnail?: string | null
  isActive?: boolean
  images?: string[] | null
  categoryId: string
  topics?: string[] | null
}

export { bookSchema, type IBookAdd }
