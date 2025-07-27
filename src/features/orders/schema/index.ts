import { z } from 'zod'

const orderItemSchema = z.object({
  bookId: z.number().int().positive({ message: 'bookId باید عدد صحیح مثبت باشد' }),
  quantity: z.number().int().positive({ message: 'quantity باید عدد صحیح مثبت باشد' }),
})

export const orderCreateSchema = z.object({
  totalAmount: z.number().positive({ message: 'totalAmount الزامی و باید عدد مثبت باشد' }),
  addressId: z.number().int().positive().optional(),

  items: z.array(orderItemSchema).min(1, { message: 'حداقل یک آیتم برای سفارش نیاز است' }),
})

export const orderUpdateSchema = z
  .object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    addressId: z.number().optional(),
  })
  .optional()
