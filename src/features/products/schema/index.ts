import { z } from 'zod'

export const bookCreateSchema = z.object({
  title: z.string().min(1, { message: 'عنوان کتاب الزامی است' }),
  description: z.string().max(2000).optional(),
  isbn: z
    .string()
    .regex(/^[0-9\-]{10,17}$/, { message: 'فرمت ISBN نامعتبر است' })
    .optional(),
  price: z.number().positive({ message: 'قیمت باید عدد مثبت باشد' }),
  stock: z.number().int().nonnegative({ message: 'stock نباید منفی باشد' }),
  pages: z.number().int().positive().optional(),
  publisherId: z.number().int().positive(),
  isActive: z.boolean().optional(),
  publishYear: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), { message: 'تاریخ نامعتبر است' }),
  printEdition: z.int().optional(),
  language: z.string().optional(),
  paperType: z.string().optional(),
  height: z.int().positive().optional(),
  width: z.int().positive().optional(),
  weight: z.int().positive().optional(),

  // many-to-many relations
  categoryIds: z.array(z.number().int().positive()),
  topicIds: z.array(z.number().int().positive()),
  authorIds: z.array(z.number().int().positive()),
  translatorIds: z.array(z.number().int().positive()).optional(),
  imageIds: z.array(z.string().cuid()),
})

export const bookUpdateSchema = bookCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })

export type ICreateBookSchemaType = z.infer<typeof bookCreateSchema>
