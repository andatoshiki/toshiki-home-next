'use client'

import { useState, useMemo } from 'react'
import { Title } from '~/components/title'
import { usesList } from '.velite'
import {
  UsesTypeTabs,
  UsesType,
  HardwareCard,
  SoftwareGrid,
  SoftwareModal
} from './_components'
import type { UsesEntry } from '.velite'

export default function UsesPage() {
  const [activeType, setActiveType] = useState<UsesType>('software')
  const [selectedItem, setSelectedItem] = useState<UsesEntry | null>(null)

  const filteredItems = useMemo(() => {
    return usesList
      .filter(item => item.type === activeType)
      .sort((a, b) => {
        // Featured items first
        if (a.featured !== b.featured) {
          return b.featured ? 1 : -1
        }
        // Then alphabetically
        return a.name.localeCompare(b.name)
      })
  }, [activeType])

  return (
    <div className="content-vertical-spaces content-container m-auto space-y-8">
      <div className="space-y-4">
        <Title
          text="Uses"
          description="Tools, software, and hardware I use daily for development and work"
        />
      </div>

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
      </div>

      <SoftwareModal
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={open => !open && setSelectedItem(null)}
      />
    </div>
  )
}
