import { createCartSchema } from '@/features/cart/schema'
import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            book: {
              select: { id: true, title: true },
            },
          },
        },
      },
    })

    if (!cart) {
      return ApiResponseHandler.success({
        cartId: null,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      })
    }

    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    const totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

    return ApiResponseHandler.success({
      cartId: cart.id,
      items: cart.items,
      totalQuantity,
      totalPrice,
    })
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized()
    }

    const body = await request.json()

    const validationResult = createCartSchema.safeParse(body)

    if (!validationResult.success) {
      return ApiResponseHandler.validationError(validationResult.error._zod.def)
    }

    const cartItems = validationResult.data.cartItems
    const incomingBookIds = cartItems.map((cartItem) => cartItem.bookId)

    const books = await prisma.book.findMany({
      where: { id: { in: incomingBookIds } },
      select: { id: true, price: true },
    })

    if (books.length !== incomingBookIds.length) {
      return ApiResponseHandler.notFound('Some books do not exist.')
    }

    const bookMap = new Map(books.map((b) => [b.id, b.price]))

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.upsert({
        where: {
          userId: user.id,
        },
        update: {},
        create: {
          userId: user.id,
        },
      })

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          bookId: { notIn: incomingBookIds },
        },
      })

      await Promise.all(
        cartItems.map((item) =>
          tx.cartItem.upsert({
            where: {
              cartId_bookId: {
                cartId: cart.id,
                bookId: item.bookId,
              },
            },
            update: {
              quantity: item.quantity,
              price: bookMap.get(item.bookId)!,
            },
            create: {
              cartId: cart.id,
              bookId: item.bookId,
              quantity: item.quantity,
              price: bookMap.get(item.bookId)!,
            },
          })
        )
      )

      return cart
    })

    return ApiResponseHandler.success(result)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
