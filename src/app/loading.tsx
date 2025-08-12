'use client'

export default function loading() {
  return (
    <div className="fixed flex h-screen w-screen items-center justify-center">
      <div className="border-t-brand-600 size-28 animate-spin rounded-full border !border-t-[10px] border-transparent" />
    </div>
  )
}
