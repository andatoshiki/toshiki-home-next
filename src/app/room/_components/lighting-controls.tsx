'use client'

import * as Slider from '@radix-ui/react-slider'
import clsx from 'clsx'

const LIGHT_PRESETS = [
  { name: 'Dim', ambientIntensity: 1.0, directionalIntensity: 1.0 },
  { name: 'Balanced', ambientIntensity: 2.5, directionalIntensity: 2.0 },
  { name: 'Bright', ambientIntensity: 3.5, directionalIntensity: 3.0 },
  { name: 'Very Bright', ambientIntensity: 4.5, directionalIntensity: 4.0 }
] as const

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
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LIGHT_PRESETS.map(preset => {
          const isActive =
            ambientIntensity === preset.ambientIntensity &&
            directionalIntensity === preset.directionalIntensity

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onAmbientChange(preset.ambientIntensity)
                onDirectionalChange(preset.directionalIntensity)
              }}
              className={clsx(
                'touch-manipulation rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600',
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
              )}
              aria-pressed={isActive}
            >
              {preset.name}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Ambient Light
            </span>
            <span className="text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
              {ambientIntensity.toFixed(2)}
            </span>
          </div>
          <Slider.Root
            value={[ambientIntensity]}
            onValueChange={value => onAmbientChange(value[0])}
            min={0}
            max={5}
            step={0.1}
            className="relative flex w-full items-center"
          >
            <Slider.Track className="relative h-1 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-white" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-4 w-4 rounded-full bg-neutral-900 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-white dark:focus-visible:ring-neutral-600"
              aria-label="Ambient Light"
            />
          </Slider.Root>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              Directional Light
            </span>
            <span className="text-sm tabular-nums text-neutral-600 dark:text-neutral-400">
              {directionalIntensity.toFixed(2)}
            </span>
          </div>
          <Slider.Root
            value={[directionalIntensity]}
            onValueChange={value => onDirectionalChange(value[0])}
            min={0}
            max={5}
            step={0.1}
            className="relative flex w-full items-center"
          >
            <Slider.Track className="relative h-1 flex-grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-full rounded-full bg-neutral-900 dark:bg-white" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-4 w-4 rounded-full bg-neutral-900 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-white dark:focus-visible:ring-neutral-600"
              aria-label="Directional Light"
            />
          </Slider.Root>
        </div>
      </div>
    </div>
  )
}
