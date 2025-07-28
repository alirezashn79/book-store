import z from 'zod'

export const createReviewSchema = z.object({
  bookId: z.number().int().positive({ message: 'bookId باید عدد صحیح مثبت باشد' }),
  rating: z.number().min(1).max(5, { message: 'rating بین ۱ تا ۵ باشد' }),
  comment: z.string().max(500).optional(),
})

export const reviewUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
})
export type CreateReviewInput = z.infer<typeof createReviewSchema>
