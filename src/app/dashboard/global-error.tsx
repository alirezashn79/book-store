'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>مشکلی پیش آمده است!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>تلاش دوباره</button>
      </body>
    </html>
  )
}
