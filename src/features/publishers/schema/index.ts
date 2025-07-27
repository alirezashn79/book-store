import { z } from 'zod'

export const createPublisherSchema = z.object({
  name: z.string().min(1, 'نام ناشر الزامی است'),
  website: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})
export const publisherUpdateSchema = createPublisherSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreatePublisherInput = z.infer<typeof createPublisherSchema>
