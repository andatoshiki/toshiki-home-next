import { RoomViewer } from './_components/room-viewer'
import { Title } from '~/components/title'

export const metadata = {
  title: 'My Room in 3D',
  description: 'Interactive 3D model of my room'
}

export default function RoomPage() {
  return (
    <div className="content-container m-auto space-y-10">
      <Title text="My Room in 3D" />
      <p className="text-neutral-600 dark:text-neutral-400">
        An interactive 3D visualization of my room. Explore by dragging and
        scrolling.
      </p>
      <RoomViewer />
    </div>
  )
}
