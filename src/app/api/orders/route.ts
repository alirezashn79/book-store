import { orderCreateSchema } from '@/features/orders/schema'
import { getCurrentUser } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { SearchConfig } from '@/types/api'
import { ApiResponseHandler } from '@/utils/apiResponse'
import { PaginationHelper } from '@/utils/pagination'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return ApiResponseHandler.unauthorized('کاربر شناسایی نشد')
    }

    const { page, limit, skip, filters } = PaginationHelper.extractParams(request)

    const validationError = PaginationHelper.validateParams(page, limit)

    if (validationError) {
      return ApiResponseHandler.error(validationError, 400)
    }

    const searchConfig: SearchConfig = {
      filterFields: ['status'],
    }

    const where = PaginationHelper.buildWhereClause(undefined, filters, searchConfig)

    const [data, total] = await prisma.$transaction([
      prisma.order.findMany({
        where: {
          ...where,
          userId: user.id,
        },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          items: {
            select: {
              book: {
                select: {
                  id: true,
                  title: true,
                },
              },
              quantity: true,
              unitPrice: true,
              totalPrice: true,
            },
          },
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { ...where, userId: user.id } }),
    ])

    const meta = PaginationHelper.createMeta(total, page, limit, undefined, filters)

    const response = {
      data,
      meta,
    }

    return ApiResponseHandler.success(response)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return ApiResponseHandler.unauthorized('کاربر شناسایی نشد')
    }

    const body = await request.json()
    const validation = orderCreateSchema.safeParse(body)
    if (!validation.success) {
      return ApiResponseHandler.validationError(validation.error._zod.def)
    }

    const { items: rawItems, addressId } = validation.data

    // ۲) واکشی قیمت‌ها از جدول کتاب
    const bookIds = Array.from(new Set(rawItems.map((i) => i.bookId)))
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
      select: { id: true, price: true },
    })

    if (books.length !== bookIds.length) {
      return ApiResponseHandler.validationError([{ message: 'یک یا چند کتاب یافت نشد' }])
    }

    // ۳) محاسبه‌ی unitPrice و totalPrice برای هر آیتم
    const computedItems = rawItems.map((item) => {
      const book = books.find((b) => b.id === item.bookId)!
      const unitPrice = book.price
      const totalPrice = unitPrice * item.quantity
      return {
        orderId: 0, // موقتاً؛ بعد از create سفارش اصلاح می‌شود
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      }
    })

    // ۴) جمع‌کردن totalAmount
    const totalAmount = computedItems.reduce((sum, it) => sum + it.totalPrice, 0)

    // ۵) اجرای همه‌ی عملیات در یک تراکنش اتمیک
    const result = await prisma.$transaction(async (tx) => {
      // ۵.۱ ایجاد سفارش
      const order = await tx.order.create({
        data: {
          userId: user.id,
          addressId,
          totalAmount,
          status: 'PENDING', // یا اگر default اسکیمای شما PENDING است، لازم نیست اینجا بزنید
        },
      })

      // ۵.۲ ایجاد آیتم‌ها (و اصلاح orderId در هر آیتم)
      const itemsToCreate = computedItems.map((it) => ({
        ...it,
        orderId: order.id,
      }))

      // از createMany استفاده می‌کنیم چون نیازی به برگشت آرایه نداریم
      await tx.orderItem.createMany({
        data: itemsToCreate,
      })

      // ۵.۳ ایجاد تراکنش اولیه
      const initialTransaction = await tx.transaction.create({
        data: {
          orderId: order.id,
          userId: user.id,
          amount: totalAmount,
          status: 'PENDING',
          method: 'DIRECT_PAY', // یا هر پیش‌فرض دیگری
        },
      })

      return { order, initialTransaction, items: itemsToCreate }
    })

    return ApiResponseHandler.success(result, 'سفارش با موفقیت ثبت شد', 201)
  } catch (error) {
    return ApiResponseHandler.internalError(undefined, error)
  }
}
