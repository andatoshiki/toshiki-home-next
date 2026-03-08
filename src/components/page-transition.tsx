'use client'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  pathname: string
}

export default function PageTransition({
  children,
  pathname
}: PageTransitionProps) {
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
