'use client'

import { useState } from 'react'
import * as Slider from '@radix-ui/react-slider'
import clsx from 'clsx'

interface LightingPreset {
  name: string
  ambientIntensity: number
  directionalIntensity: number
}

const LIGHT_PRESETS: LightingPreset[] = [
  { name: 'Dim', ambientIntensity: 1.0, directionalIntensity: 1.0 },
  { name: 'Balanced', ambientIntensity: 2.5, directionalIntensity: 2.0 },
  { name: 'Bright', ambientIntensity: 3.5, directionalIntensity: 3.0 },
  { name: 'Very Bright', ambientIntensity: 4.5, directionalIntensity: 4.0 }
]

interface LightingControlsProps {
  ambientIntensity: number
  directionalIntensity: number
  onAmbientChange: (value: number) => void
  onDirectionalChange: (value: number) => void
}

export function LightingControls({
  ambientIntensity,
  directionalIntensity,
  onAmbientChange,
  onDirectionalChange
}: LightingControlsProps) {
  const [customMode, setCustomMode] = useState(true)

  const applyPreset = (preset: LightingPreset) => {
    onAmbientChange(preset.ambientIntensity)
    onDirectionalChange(preset.directionalIntensity)
    setCustomMode(false)
  }

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {LIGHT_PRESETS.map(preset => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={clsx(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              customMode
                ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                : ambientIntensity === preset.ambientIntensity &&
                    directionalIntensity === preset.directionalIntensity
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-neutral-900 dark:text-white">
              Ambient Light
            </label>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {ambientIntensity.toFixed(2)}
            </span>
          </div>
          <Slider.Root
            value={[ambientIntensity]}
            onValueChange={value => {
              onAmbientChange(value[0])
              setCustomMode(true)
            }}
            min={0}
            max={5}
            step={0.1}
            className="relative flex w-full items-center"
          >
            <Slider.Track className="relative h-1 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-white" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full bg-neutral-900 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:focus:ring-neutral-600" />
          </Slider.Root>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <label className="text-sm font-medium text-neutral-900 dark:text-white">
              Directional Light
            </label>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {directionalIntensity.toFixed(2)}
            </span>
          </div>
          <Slider.Root
            value={[directionalIntensity]}
            onValueChange={value => {
              onDirectionalChange(value[0])
              setCustomMode(true)
            }}
            min={0}
            max={5}
            step={0.1}
            className="relative flex w-full items-center"
          >
            <Slider.Track className="relative h-1 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-white" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full bg-neutral-900 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-white dark:focus:ring-neutral-600" />
          </Slider.Root>
        </div>
      </div>
    </div>
  )
}
