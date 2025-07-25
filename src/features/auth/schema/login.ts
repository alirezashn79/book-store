import { phoneRegex } from '@/utils/regex'
import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.union([
    z.string().email({ message: 'ایمیل معتبر نیست.' }),
    z.string().regex(phoneRegex, { message: 'شماره تلفن وارد شده معتبر نیست.' }),
  ]),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' }),
})
