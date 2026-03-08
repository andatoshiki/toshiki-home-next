import { ErrorCard } from '~/components/errors'

export default function NotFound() {
  return <ErrorCard statusCode={404} />
}
