'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const RoomCanvasClient = dynamic(
  () => import('./room-canvas-client').then(mod => mod.RoomCanvasClient),
  { ssr: false }
)

interface RoomCanvasProps {
  ambientIntensity: number
  directionalIntensity: number
  autoRotationSpeed: number
  onLoadingChange: (loading: boolean) => void
  onError: (error: string | null) => void
}

export function RoomCanvas({
  ambientIntensity,
  directionalIntensity,
  autoRotationSpeed,
  onLoadingChange,
  onError
}: RoomCanvasProps) {
  return (
    <RoomCanvasClient
      ambientIntensity={ambientIntensity}
      directionalIntensity={directionalIntensity}
      autoRotationSpeed={autoRotationSpeed}
      onLoadingChange={onLoadingChange}
      onError={onError}
    />
  )
}
