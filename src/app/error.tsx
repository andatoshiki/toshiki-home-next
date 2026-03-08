'use client'

import { ErrorCard } from '~/components/errors'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorCard statusCode={500} error={error} reset={reset} />
}
