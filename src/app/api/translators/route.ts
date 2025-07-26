import { createTranslatorSchema } from '@/features/translators/schema'
import { adminOnly, getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const translators = await prisma.translator.findMany({
      orderBy: {
        lastName: 'desc',
      },
    })

    return ApiResponseHandler.success(translators)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    const authResponse = adminOnly(user)
    if (authResponse) return authResponse

    const body = await request.json()

    const validationResult = createTranslatorSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const translator = await prisma.translator.create({
      data: validationResult.data,
    })

    return ApiResponseHandler.success(translator, 'مترجم با موفقیت ایجاد شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
