import z from 'zod'

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email({ message: 'ایمیل معتبر نیست.' }).optional(),
    phone: z
      .string()
      .regex(/^(?:\+98|0)(9\d{9}|2[1-5]\d{8})$/, { message: 'شماره تلفن وارد شده معتبر نیست.' })
      .optional(),
    role: z.enum(['CUSTOMER', 'ADMIN'], { message: 'نقش کاربر معتبر نیست.' }),
    isActive: z.boolean().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })

export type CreateUserInput = z.infer<typeof updateUserSchema>
