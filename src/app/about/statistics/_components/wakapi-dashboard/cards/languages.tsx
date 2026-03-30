'use client'

import { useEffect, useMemo, useState } from 'react'
import { Code } from '@phosphor-icons/react/dist/ssr'
import { aggregateLanguages } from '~/lib/api/wakapi'
import { LanguagesChart } from '../charts/languages-chart'
import { LanguagesSkeleton } from '../skeleton/languages-skeleton'
import { useWakapiRecentSummaries } from '../data/provider'
import { DropdownSelect } from '../components/dropdown-select'

const LIMIT_OPTIONS = [5, 8, 12, 15]

function getLimitOptions(totalItems: number) {
  const options = LIMIT_OPTIONS.filter(
    option => option <= totalItems || option === 5
  ).map(option => ({
    value: option,
    label: `Top ${option}`
  }))

  if (totalItems > 15) {
    options.push({
      value: totalItems,
      label: `All (${totalItems})`
    })
  }

  return options
}

export function WakapiLanguages() {
  const [limit, setLimit] = useState(8)
  const { data: summaries, error, isLoading } = useWakapiRecentSummaries(30)
  const data = useMemo(() => aggregateLanguages(summaries), [summaries])
  const limitOptions = useMemo(
    () => getLimitOptions(data.length),
    [data.length]
  )

  useEffect(() => {
    if (limitOptions.length === 0) {
      return
    }

    if (!limitOptions.some(option => option.value === limit)) {
      setLimit(limitOptions[0].value)
    }
  }, [limit, limitOptions])

  if (isLoading) {
    return <LanguagesSkeleton />
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Languages</span>
          <Code size="1em" weight="duotone" />
        </span>
        <div className="flex h-[220px] items-center justify-center text-neutral-500 dark:text-neutral-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 leading-none dark:border-neutral-800 dark:bg-neutral-950 md:p-7">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <span>Languages</span>
          <Code size="1em" weight="duotone" />
        </span>
        {data.length > 5 && limitOptions.length > 0 && (
          <DropdownSelect
            value={limit}
            options={limitOptions}
            onChange={setLimit}
          />
        )}
      </div>
      <div className="flex h-full items-center justify-center">
        <LanguagesChart data={data} limit={limit} />
      </div>
    </div>
  )
}
