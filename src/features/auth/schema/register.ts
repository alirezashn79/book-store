import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'نام الزامی است.' }),
  email: z.string().email({ message: 'ایمیل معتبر نیست.' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' }),
  phone: z
    .string()
    .regex(/^(?:\+98|0)(9\d{9}|2[1-5]\d{8})$/, { message: 'شماره تلفن وارد شده معتبر نیست.' })
    .optional()
    .nullable(),
})
