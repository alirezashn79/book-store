import { z } from 'zod'

export const createTranslatorSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  biography: z.string().optional(),
})
export type CreateTranslatorInput = z.infer<typeof createTranslatorSchema>
