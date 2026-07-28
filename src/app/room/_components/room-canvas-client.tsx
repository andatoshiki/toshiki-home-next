'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Gltf, OrbitControls } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'
import * as THREE from 'three'
import { useAbsoluteTheme } from '~/hooks/use-absolute-theme'

const ROOM_MODEL_PATH = '/assets/stopsign.glb'
const CAMERA = {
  position: [3, 20, 30] as [number, number, number],
  fov: 10
}

interface RoomCanvasClientProps {
  ambientIntensity: number
  directionalIntensity: number
  autoRotationSpeed: number
  onLoad: () => void
  onError: () => void
}

function Model({ onLoad }: Pick<RoomCanvasClientProps, 'onLoad'>) {
  useEffect(() => {
    onLoad()
  }, [onLoad])

  return <Gltf src={ROOM_MODEL_PATH} />
}

function RotatingGroup({
  autoRotationSpeed,
  children
}: {
  autoRotationSpeed: number
  children: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current && autoRotationSpeed > 0) {
      groupRef.current.rotation.y += (autoRotationSpeed / 100) * delta * 0.5
    }
  })

  return <group ref={groupRef}>{children}</group>
}

function SceneContent({
  ambientIntensity,
  directionalIntensity,
  autoRotationSpeed,
  onLoad,
  onError
}: RoomCanvasClientProps) {
  const theme = useAbsoluteTheme()
  const backgroundColor = theme === 'dark' ? '#0a0a0a' : '#ececec'

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 8, 5]} intensity={directionalIntensity} />
      <ErrorBoundary fallback={null} onError={onError}>
        <Suspense fallback={null}>
          <RotatingGroup autoRotationSpeed={autoRotationSpeed}>
            <Model onLoad={onLoad} />
          </RotatingGroup>
        </Suspense>
      </ErrorBoundary>
      <OrbitControls keyEvents />
    </>
  )
}

export function RoomCanvasClient(props: RoomCanvasClientProps) {
  return (
    <Canvas
      camera={CAMERA}
      role="group"
      aria-label="Interactive 3D room model"
      aria-describedby="room-viewer-instructions"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
      tabIndex={0}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}
