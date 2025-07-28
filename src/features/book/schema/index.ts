import { z } from 'zod'

export const BookFormatEnum = z.enum(['PHYSICAL', 'PDF'])

export const bookCreateSchema = z.object({
  title: z.string().min(1, { message: 'عنوان کتاب الزامی است' }),
  description: z.string().max(2000).optional(),
  isbn: z
    .string()
    .regex(/^[0-9\-]{10,17}$/, { message: 'فرمت ISBN نامعتبر است' })
    .optional(),
  price: z.number().positive({ message: 'قیمت باید عدد مثبت باشد' }),
  stock: z.number().int().nonnegative({ message: 'stock نباید منفی باشد' }).default(0),
  pages: z.number().int().positive().optional(),
  pdfUrl: z.string().url({ message: 'آدرس pdfUrl باید یک URL معتبر باشد' }).optional(),
  format: BookFormatEnum.default('PHYSICAL'),
  publisherId: z.number().int().positive().optional(),

  // many-to-many relations
  categoryIds: z.array(z.number().int().positive()).optional(),
  topicIds: z.array(z.number().int().positive()).optional(),
  authorIds: z.array(z.number().int().positive()).optional(),
  translatorIds: z.array(z.number().int().positive()).optional(),
  imageIds: z.array(z.string().cuid()).optional(),
})

export const bookUpdateSchema = bookCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateBookInput = z.infer<typeof bookCreateSchema>
