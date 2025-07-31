import { phoneRegex } from '@/utils/regex'
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'نام الزامی است.' }),
  email: z.string().email({ message: 'ایمیل معتبر نیست.' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' }),
  phone: z
    .string()
    .regex(phoneRegex, { message: 'شماره تلفن وارد شده معتبر نیست.' })
    .optional()
    .nullable(),
})

export const registerFormSchema = z
  .object({
    fname: z.string().nonempty('نام الزامی است'),
    lname: z.string().nonempty('نام خانوادگی الزامی است'),
    email: z.string().nonempty('ایمیل الزامی است').email('فرمت ایمیل صحیح نیست'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          return !val || phoneRegex.test(val)
        },
        { message: 'فرمت شماره موبایل صحیح نیست' }
      ),
    password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(6, 'تکرار رمز عبور باید حداقل ۶ کاراکتر باشد'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'رمز عبور و تکرار آن مطابقت ندارند',
      })
    }
  })

export type RegisterApiValues = z.infer<typeof registerSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>
