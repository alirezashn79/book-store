import { z } from 'zod'

export const transactionCreateSchema = z.object({
  orderId: z.number().int().positive({ message: 'شناسه سفارش باید یک عدد صحیح مثبت باشد' }),
  transactionDate: z.date().optional(),
  amount: z.number().positive({ message: 'مبلغ باید یک عدد مثبت باشد' }),
  method: z.enum(['CART_TO_CART', 'DIRECT_PAY']).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  userId: z.number().int().positive(),
  reference: z.string().optional().nullable(),
})
export const transactionUpdateSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
  method: z.enum(['CART_TO_CART', 'DIRECT_PAY']).optional(),
  reference: z.string().optional().nullable(),
})
export type CreateTransactionInput = z.infer<typeof transactionCreateSchema>
