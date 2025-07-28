import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'نام دسته بندی الزامی است'),
  description: z.string().optional().nullable(),
  parentId: z.number().optional().nullable(),
})
export const categoryUpdateSchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
