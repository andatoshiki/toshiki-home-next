'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'

type DropdownOption = {
  label: string
  value: number
}

interface DropdownSelectProps {
  value: number
  options: DropdownOption[]
  onChange: (value: number) => void
}

export function DropdownSelect({
  value,
  options,
  onChange
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedOption =
    options.find(option => option.value === value) ?? options[0]

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  if (!selectedOption) {
    return null
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        {selectedOption.label}
        <CaretDown
          size={12}
          weight="bold"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`block w-full px-3 py-1 text-left text-xs transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                option.value === value
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
