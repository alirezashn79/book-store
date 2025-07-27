import { z } from 'zod'

export const createTopicrSchema = z.object({
  name: z.string().min(1, 'نام ناشر الزامی است'),
  description: z.string().optional().nullable(),
})
export const topicrUpdateSchema = createTopicrSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateTopicrInput = z.infer<typeof createTopicrSchema>
