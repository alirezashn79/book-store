import { z } from 'zod'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024
const MAX_PDF_SIZE = 10 * 1024 * 1024

export const uploadFileSchema = z.object({
  file: z
    .any()
    .refine((val) => val instanceof File, {
      message: 'هیچ فایلی ارسال نشده است.',
    })
    .refine(
      (file: File) => {
        if (file.type.startsWith('image/')) {
          return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
        }
        if (file.type.startsWith('video/')) {
          return ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)
        }
        if (file.type === 'application/pdf') {
          return true
        }
        return false
      },
      {
        message: 'فرمت فایل نامعتبر است. فقط JPEG/PNG/WEBP یا MP4/WebM/MOV یا PDF مجاز است.',
      }
    )
    .refine(
      (file: File) => {
        if (file.type.startsWith('image/')) {
          return file.size <= MAX_IMAGE_SIZE
        }
        if (file.type.startsWith('video/')) {
          return file.size <= MAX_VIDEO_SIZE
        }
        if (file.type === 'application/pdf') {
          return file.size <= MAX_PDF_SIZE
        }
        return false
      },
      {
        message: 'حجم فایل از حد مجاز بیشتر است.',
      }
    ),
})

export type UploadFileInput = z.infer<typeof uploadFileSchema>
