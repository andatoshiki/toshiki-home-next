'use client'

import { ErrorCard } from '~/components/errors'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <ErrorCard statusCode={500} error={error} reset={reset} />
      </body>
    </html>
  )
}
