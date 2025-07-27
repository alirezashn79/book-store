import { z } from 'zod'

export const createAddressSchema = z.object({
  country: z.string().optional(),
  state: z.string().min(1, { message: 'استان الزامی است' }),
  city: z.string().min(1, { message: 'شهر الزامی است' }),
  street: z.string().min(1, { message: 'خیابان الزامی است' }),
  postalCode: z.string().min(1, { message: 'کد پستی الزامی است' }),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  isDefault: z.boolean().optional(),
  type: z.string().optional(),
})

export const addressUpdateSchema = createAddressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateAddressInput = z.infer<typeof createAddressSchema>
