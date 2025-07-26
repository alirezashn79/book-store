import { authorUpdateSchema } from '@/features/authors/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const author = await prisma.author.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!author) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(author)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const body = await request.json()

    const validationResult = authorUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }
    const data = {
      ...validationResult.data,
      ...(validationResult.data.birthDate && {
        birthDate: new Date(validationResult.data.birthDate),
      }),
      ...(validationResult.data.deathDate && {
        birthDate: new Date(validationResult.data.deathDate),
      }),
    }
    const updated = await prisma.author.update({
      where: { id: Number(id) },
      data,
    })

    return ApiResponseHandler.success(updated)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const authorId = Number(id)
    const author = await prisma.author.findUnique({
      where: {
        id: authorId,
      },
    })

    if (!author) {
      return ApiResponseHandler.notFound()
    }

    await prisma.$transaction([
      ...(author.photoId
        ? [
            prisma.media.delete({
              where: { id: author.photoId },
            }),
          ]
        : []),
      prisma.author.delete({ where: { id: authorId } }),
    ])

    return ApiResponseHandler.success(undefined, 'نویسنده با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
