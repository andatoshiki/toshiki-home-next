import { ReactNode } from 'react'

interface UsesLayoutProps {
  children: ReactNode
}

export const metadata = {
  title: 'Uses',
  description: 'Tools, software, and hardware I use for development and work.'
}

export default function UsesLayout({ children }: UsesLayoutProps) {
  return children
}
