'use client'
import { usePathname } from 'next/navigation'
import PageTransition from './page-transition'

interface LayoutTransitionProps {
  children: React.ReactNode
}

export default function LayoutTransition({ children }: LayoutTransitionProps) {
  const pathname = usePathname()

  return <PageTransition pathname={pathname}>{children}</PageTransition>
}
