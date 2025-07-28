import { categoryUpdateSchema } from '@/features/categories/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { Params } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        description: true,
        parent: {
          select: {
            id: true,
            name: true,
            parent: {
              select: {
                id: true,
                name: true,
                parent: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!category) {
      return ApiResponseHandler.notFound()
    }

    return ApiResponseHandler.success(category)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!category) {
      return ApiResponseHandler.notFound()
    }

    const body = await request.json()

    const validationResult = categoryUpdateSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const data = validationResult.data
    const updated = await prisma.category.update({
      where: { id: category.id },
      data: {
        ...data,
        id: category.id,
      },
    })

    return ApiResponseHandler.success(updated, 'دسته بندی با موفقیت بروزرسانی شد')
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

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
      },
    })

    if (!category) {
      return ApiResponseHandler.notFound()
    }

    const deleted = await prisma.category.delete({
      where: { id: category.id },
    })

    return ApiResponseHandler.success(deleted, 'دسته بندی با موفقیت حذف شد')
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
