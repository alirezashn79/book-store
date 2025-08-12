import { updateUserSchema } from '@/app/(app)/profile/_types'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { s3 } from '@/libs/s3'
import { imageSchema } from '@/schema/image'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextRequest } from 'next/server'
import { getPlaiceholder } from 'plaiceholder'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)

    if (authResponse) return authResponse

    const { id } = await params

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      omit: { password: true },
      include: {
        orders: {
          include: {
            items: {
              select: {
                book: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            book: {
              select: {
                id: true,
                title: true,
              },
            },
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    return ApiResponseHandler.success(userDB)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)

    if (!user) return ApiResponseHandler.unauthorized()

    const { id } = await params

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    const body = await request.json()

    const validationResult = updateUserSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error)
    }

    const updated = await prisma.user.update({
      where: { id: userDB.id },
      data: validationResult.data,
    })

    return ApiResponseHandler.success(updated, 'کاربر با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return ApiResponseHandler.unauthorized()

    const { id } = await params

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    const body = await request.formData()
    const avatar = body.get('avatar') as File
    const validationResult = imageSchema.safeParse(avatar)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error)
    }

    const file = validationResult.data

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let blurDataURL: string | null = null

    if (file.type.startsWith('image/')) {
      const { base64 } = await getPlaiceholder(buffer, { size: 10 })
      blurDataURL = base64
    }

    const fileName = `avatars/${Date.now()}-${file.name}`
    const command = new PutObjectCommand({
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
    await s3.send(command)
    const url = `${process.env.LIARA_ACCESS_ENDPOINT}/${fileName}`

    const updated = await prisma.user.update({
      where: { id: userDB.id },
      data: { avatar: url, avatarBlurDataURL: blurDataURL },
    })

    return ApiResponseHandler.success(updated, 'پروفایل با موفقیت بروزرسانی شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)

    if (authResponse) return authResponse

    const { id } = await params

    const userDB = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true },
    })

    if (!userDB) {
      return ApiResponseHandler.notFound('کاربری پیدا نشد')
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId: userDB.id } })
      await tx.review.deleteMany({ where: { userId: userDB.id } })
      await tx.transaction.deleteMany({ where: { userId: userDB.id } })
      await tx.cart.deleteMany({ where: { userId: userDB.id } })
      await tx.address.deleteMany({ where: { userId: userDB.id } })
      await tx.user.delete({ where: { id: userDB.id } })
    })

    return ApiResponseHandler.success(undefined, 'کاربر با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
