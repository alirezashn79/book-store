import z from 'zod'
export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email({ message: 'ایمیل معتبر نیست.' }).optional(),
    phone: z
      .string()
      .regex(/^(?:\+98|0)(9\d{9}|2[1-5]\d{8})$/, { message: 'شماره تلفن وارد شده معتبر نیست.' })
      .optional(),
    password: z.string().min(4).optional(),
    role: z.enum(['CUSTOMER', 'ADMIN'], { message: 'نقش کاربر معتبر نیست.' }).optional(),
    isActive: z.boolean().optional(),
    bio: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })

export type UpdateUserInput = z.infer<typeof updateUserSchema>
