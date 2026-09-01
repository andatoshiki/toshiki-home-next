'use client'

import { useMemo, useState } from 'react'
import type { UsesEntry } from '#content'
import { HardwareCard } from './_components/hardware-card'
import { SoftwareGrid } from './_components/software-grid'
import { SoftwareModal } from './_components/software-modal'
import { UsesTypeTabs, type UsesType } from './_components/uses-type-tabs'

interface UsesClientProps {
  items: UsesEntry[]
}

export function UsesClient({ items }: UsesClientProps) {
  const [activeType, setActiveType] = useState<UsesType>('software')
  const [selectedItem, setSelectedItem] = useState<UsesEntry | null>(null)

  const filteredItems = useMemo(
    () =>
      items
        .filter(item => item.type === activeType)
        .sort((a, b) => {
          if (activeType === 'software') {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()

            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          }

          if (a.featured !== b.featured) {
            return b.featured ? 1 : -1
          }

          return a.name.localeCompare(b.name)
        }),
    [activeType, items]
  )

  return (
    <div className="space-y-8">
      <UsesTypeTabs activeType={activeType} onTypeChange={setActiveType} />

      {filteredItems.length > 0 ? (
        activeType === 'software' ? (
          <div className="space-y-3">
            <SoftwareGrid
              items={filteredItems}
              backgroundImage="/assets/wallpaper.jpg"
              backgroundImageDark="/assets/wallpaper-dark.jpg"
              onItemClick={setSelectedItem}
            />
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Initial idea accrediting{' '}
              <a
                href="https://jahirfiquitiva-os-website.vercel.app/uses#software"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                @Jahir
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredItems.map(item => (
              <HardwareCard key={item.id} item={item} />
            ))}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No items found in this category.
          </p>
        </div>
      )}

      <SoftwareModal
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={open => !open && setSelectedItem(null)}
      />
    </div>
  )
}
