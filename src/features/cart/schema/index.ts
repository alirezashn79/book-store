import { z } from 'zod'

export const createCartSchema = z.object({
  cartItems: z.array(
    z.object({
      bookId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
})

export const cartUpdateSchema = createCartSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateCartInput = z.infer<typeof createCartSchema>
