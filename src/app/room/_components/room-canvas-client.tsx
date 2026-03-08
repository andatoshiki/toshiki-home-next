'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Gltf, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface RoomCanvasClientProps {
  ambientIntensity: number
  directionalIntensity: number
  autoRotationSpeed: number
  onLoadingChange: (loading: boolean) => void
  onError: (error: string | null) => void
}

function Model({
  onLoadingChange,
  onError
}: {
  onLoadingChange: (loading: boolean) => void
  onError: (error: string | null) => void
}) {
  return (
    <Suspense fallback={null}>
      <Gltf
        src="/assets/stopsign.glb"
        onLoad={() => {
          console.log('Model loaded successfully')
          onLoadingChange(false)
        }}
        onError={(error: any) => {
          console.error('Error loading model:', error)
          onError('Failed to load 3D model')
          onLoadingChange(false)
        }}
        scale={1}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </Suspense>
  )
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
  onLoadingChange,
  onError
}: RoomCanvasClientProps) {
  const [backgroundColor, setBackgroundColor] = useState('#ececec')
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setBackgroundColor(isDark ? '#0a0a0a' : '#ececec')

    const observer = new MutationObserver(() => {
      const newIsDark = document.documentElement.classList.contains('dark')
      setBackgroundColor(newIsDark ? '#0a0a0a' : '#ececec')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Set a timeout to mark as loaded after 2 seconds if model hasn't loaded
    loadTimeoutRef.current = setTimeout(() => {
      onLoadingChange(false)
    }, 2000)

    return () => {
      observer.disconnect()
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [onLoadingChange])

  return (
    <>
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 8, 5]} intensity={directionalIntensity} />
      <RotatingGroup autoRotationSpeed={autoRotationSpeed}>
        <Model
          onLoadingChange={loaded => {
            if (!loaded && loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current)
            }
            onLoadingChange(loaded)
          }}
          onError={onError}
        />
      </RotatingGroup>
      <OrbitControls />
    </>
  )
}

export function RoomCanvasClient(props: RoomCanvasClientProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(prev => {
        if (prev !== mobile) {
          setKey(k => k + 1) // Force re-render canvas when switching
        }
        return mobile
      })
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Narrower FOV and closer camera makes the model appear larger
  const cameraProps = isMobile
    ? // ? { position: [1, 10, 12] as [number, number, number], fov: 8 }
      { position: [3, 20, 30] as [number, number, number], fov: 10 }
    : { position: [3, 20, 30] as [number, number, number], fov: 10 }

  return (
    <Canvas
      key={key}
      camera={cameraProps}
      shadows
      onCreated={({ camera }) => {
        camera.lookAt(0, 15, 0)
      }}
    >
      <SceneContent {...props} />
    </Canvas>
  )
}
