'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateBooksAction() {
  revalidateTag('books')
}
