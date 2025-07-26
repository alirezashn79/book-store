import { z } from 'zod'

export const uploadFileSchema = z.object({
  file: z
    .any()
    .refine((val) => val instanceof File, {
      message: 'فایلی ارسال نشده است',
    })
    .refine(
      (file: File) => {
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
        return ALLOWED_TYPES.includes(file.type)
      },
      {
        message: 'فرمت فایل نامعتبر است. فقط JPEG/PNG/WEBP مجازند',
      }
    )
    .refine(
      (file: File) => {
        const MAX_SIZE_IN_BYTES = 3 * 1024 * 1024
        return file.size <= MAX_SIZE_IN_BYTES
      },
      {
        message: 'حجم فایل بیش از 3 مگابایت است',
      }
    ),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
