import { prisma } from '@/libs/prisma'
import { s3 } from '@/libs/s3'
import { uploadFileSchema } from '@/schema/upload'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
        },
        orderBy: { uploadedAt: 'desc' },
      }),
      prisma.author.count(),
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

    const validationResult = uploadFileSchema.safeParse({ file: rawFile })
    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }
    const { file } = validationResult.data

    const fileName = `${Date.now()}-${file.name}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

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
      },
    })

    return ApiResponseHandler.success(media)
  } catch (error) {
    return ApiResponseHandler.internalError('Internal Server Error', error)
  }
}
