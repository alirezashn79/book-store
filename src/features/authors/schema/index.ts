import { z } from 'zod'

export const createAuthorSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  biography: z.string().optional(),
  birthDate: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), { message: 'تاریخ نامعتبر است' }),
  deathDate: z
    .string()
    .optional()
    .refine((d) => !d || !isNaN(Date.parse(d)), { message: 'تاریخ نامعتبر است' }),
  photoId: z.string().optional(),
})
export const authorUpdateSchema = createAuthorSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'حداقل یک فیلد باید برای بروزرسانی ارسال شود.',
  })
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>
