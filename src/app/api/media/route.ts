import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { s3 } from '@/libs/s3'
import { uploadFileSchema } from '@/app/(app)/media/_schemas/upload'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/paginationHelper'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'
import { getPlaiceholder } from 'plaiceholder'
import sharp from 'sharp'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { page, limit, skip } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const [data, total] = await prisma.$transaction([
      prisma.media.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          url: true,
          fileName: true,
          blurDataURL: true,
          mimeType: true,
        },
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.media.count(),
    ])

    const meta = PaginationHelper.createMeta(total, page, limit)

    const response = {
      data,
      meta,
    }

    return ApiResponseHandler.success(response)
  } catch (error) {
    return ApiResponseHandler.internalError('Internal Server Error', error)
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const rawFile = formData.get('file')

    const validation = uploadFileSchema.safeParse({ file: rawFile })
    if (!validation.success) {
      return ApiResponseHandler.validationError(validation.error._zod.def)
    }
    const { file }: { file: File } = validation.data

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let width: number | null = null
    let height: number | null = null
    let blurDataURL: string | null = null

    if (file.type.startsWith('image/')) {
      const meta = await sharp(buffer).metadata()
      width = meta.width ?? null
      height = meta.height ?? null

      const { base64 } = await getPlaiceholder(buffer, { size: 10 })
      blurDataURL = base64
    }

    const fileName = `${Date.now()}-${file.name}`
    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
    await s3.send(command)
    const url = `${process.env.LIARA_ACCESS_ENDPOINT}/${fileName}`

    const media = await prisma.media.create({
      data: {
        url,
        fileName,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        blurDataURL,
      },
    })

    return ApiResponseHandler.success(media)
  } catch (error) {
    console.error(error)
    return ApiResponseHandler.internalError('Internal Server Error', error)
  }
}
