import z from 'zod'

export const imageSchema = z
  .instanceof(File, { message: 'هیچ فایلی ارسال نشده است.' })
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
    message: 'فرمت فایل نامعتبر است. فقط JPEG/PNG/WEBP مجاز است.',
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'حجم فایل از حد مجاز (5MB) بیشتر است.',
  })
