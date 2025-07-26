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
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>
