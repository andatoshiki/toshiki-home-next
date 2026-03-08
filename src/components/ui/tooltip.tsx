'use client'
import * as React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

interface MenuTooltipProps {
  children: React.ReactNode
  label: string
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function MenuTooltip({
  children,
  label,
  side = 'bottom'
}: MenuTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            align="center"
            forceMount
            className="menu-tooltip-content"
            sideOffset={6}
          >
            {label}
            <Tooltip.Arrow className="menu-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
