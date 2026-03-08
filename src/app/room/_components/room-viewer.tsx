'use client'

import { useState } from 'react'
import { RoomCanvas } from './room-canvas'
import { LightingControls } from './lighting-controls'
import * as Slider from '@radix-ui/react-slider'

export function RoomViewer() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ambientIntensity, setAmbientIntensity] = useState(4.5)
  const [directionalIntensity, setDirectionalIntensity] = useState(2.0)
  const [autoRotationSpeed, setAutoRotationSpeed] = useState(40)

  return (
    <div className="w-full space-y-8">
      <div className="w-full space-y-3">
        <div className="relative h-[50vh] w-full overflow-hidden rounded-lg sm:aspect-video sm:h-auto">
          <RoomCanvas
            ambientIntensity={ambientIntensity}
            directionalIntensity={directionalIntensity}
            autoRotationSpeed={autoRotationSpeed}
            onLoadingChange={setIsLoading}
            onError={setError}
          />

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-100 dark:bg-neutral-900">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900 dark:border-neutral-600 dark:border-t-white" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Loading 3D model...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          <span className="font-medium">Scroll</span> to zoom •
          <span className="font-medium"> Drag</span> to rotate
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
          Lighting
        </h3>
        <div className="space-y-6">
          <LightingControls
            ambientIntensity={ambientIntensity}
            directionalIntensity={directionalIntensity}
            onAmbientChange={setAmbientIntensity}
            onDirectionalChange={setDirectionalIntensity}
          />

          <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <div className="mb-2 flex justify-between">
              <label className="text-sm font-medium text-neutral-900 dark:text-white">
                Auto Rotation
              </label>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {autoRotationSpeed.toFixed(0)}%
              </span>
            </div>
            <Slider.Root
              value={[autoRotationSpeed]}
              onValueChange={value => setAutoRotationSpeed(value[0])}
              min={0}
              max={100}
              step={1}
              className="relative flex w-full items-center"
            >
              <Slider.Track className="relative h-1 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
                <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-white" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full bg-neutral-900 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:focus:ring-neutral-600" />
            </Slider.Root>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
              Drag to control the auto-rotation speed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
