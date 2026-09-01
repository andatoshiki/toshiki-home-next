import { usesList } from '#content'
import { Title } from '~/components/title'
import { UsesClient } from './uses-client'

export default function UsesPage() {
  return (
    <div className="content-container m-auto space-y-8">
      <div className="space-y-4">
        <Title
          text="Uses"
          description="Tools, software, and hardware I use daily for development and work"
        />
      </div>

      <UsesClient items={usesList} />
    </div>
  )
}
