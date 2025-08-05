import { z } from 'zod'

export const createTranslatorSchema = z.object({
  name: z.string().min(1),
  biography: z.string().optional(),
})
export const translatorUpdateSchema = createTranslatorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateTranslatorInput = z.infer<typeof createTranslatorSchema>
