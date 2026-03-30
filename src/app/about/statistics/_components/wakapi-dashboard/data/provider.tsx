'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import {
  fetchWakapiSummariesForDays,
  fetchWakapiSummariesForYear,
  getCurrentWakapiYear,
  type WakapiDaySummary
} from '~/lib/api/wakapi'

type WakapiQueryStatus = 'idle' | 'loading' | 'success' | 'error'

type WakapiQueryState = {
  status: WakapiQueryStatus
  data: WakapiDaySummary[]
  error: string | null
}

type WakapiDataContextValue = {
  queries: Record<string, WakapiQueryState>
  loadRecentSummaries: (days: number) => Promise<WakapiDaySummary[]>
  loadYearSummaries: (year: number) => Promise<WakapiDaySummary[]>
}

const EMPTY_QUERY_STATE: WakapiQueryState = {
  status: 'idle',
  data: [],
  error: null
}

const WakapiDataContext = createContext<WakapiDataContextValue | null>(null)

function getRecentQueryKey(days: number) {
  return `recent:${days}`
}

function getYearQueryKey(year: number) {
  return `year:${year}`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Failed to load Wakapi data'
}

export function WakapiDataProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<Record<string, WakapiQueryState>>({})
  const queriesRef = useRef(queries)
  const inflightRef = useRef<
    Partial<Record<string, Promise<WakapiDaySummary[]>>>
  >({})

  useEffect(() => {
    queriesRef.current = queries
  }, [queries])

  const updateQuery = useCallback(
    (key: string, nextState: WakapiQueryState) => {
      setQueries(prev => {
        const nextQueries = {
          ...prev,
          [key]: nextState
        }

        queriesRef.current = nextQueries

        return nextQueries
      })
    },
    [setQueries]
  )

  const executeQuery = useCallback(
    (key: string, fetcher: () => Promise<WakapiDaySummary[]>) => {
      const existing = queriesRef.current[key]

      if (existing?.status === 'success') {
        return Promise.resolve(existing.data)
      }

      if (inflightRef.current[key]) {
        return inflightRef.current[key]
      }

      updateQuery(key, {
        status: 'loading',
        data: existing?.data ?? [],
        error: null
      })

      const request = fetcher()
        .then(data => {
          updateQuery(key, {
            status: 'success',
            data,
            error: null
          })

          return data
        })
        .catch(error => {
          updateQuery(key, {
            status: 'error',
            data: existing?.data ?? [],
            error: getErrorMessage(error)
          })

          throw error
        })
        .finally(() => {
          delete inflightRef.current[key]
        })

      inflightRef.current[key] = request

      return request
    },
    [updateQuery]
  )

  const loadRecentSummaries = useCallback(
    (days: number) => {
      return executeQuery(getRecentQueryKey(days), () =>
        fetchWakapiSummariesForDays(days)
      )
    },
    [executeQuery]
  )

  const loadYearSummaries = useCallback(
    (year: number) => {
      return executeQuery(getYearQueryKey(year), () =>
        fetchWakapiSummariesForYear(year)
      )
    },
    [executeQuery]
  )

  useEffect(() => {
    void loadRecentSummaries(30)
    void loadYearSummaries(getCurrentWakapiYear())
  }, [loadRecentSummaries, loadYearSummaries])

  const value = useMemo(
    () => ({
      queries,
      loadRecentSummaries,
      loadYearSummaries
    }),
    [loadRecentSummaries, loadYearSummaries, queries]
  )

  return (
    <WakapiDataContext.Provider value={value}>
      {children}
    </WakapiDataContext.Provider>
  )
}

function useWakapiDataContext() {
  const context = useContext(WakapiDataContext)

  if (!context) {
    throw new Error(
      'useWakapiDataContext must be used within WakapiDataProvider'
    )
  }

  return context
}

function useWakapiQuery(
  queryKey: string,
  load: () => Promise<WakapiDaySummary[]>
) {
  const { queries } = useWakapiDataContext()
  const query = queries[queryKey] ?? EMPTY_QUERY_STATE

  useEffect(() => {
    void load()
  }, [load])

  return {
    data: query.data,
    error: query.error,
    isLoading: query.status === 'idle' || query.status === 'loading',
    status: query.status
  }
}

export function useWakapiRecentSummaries(days = 30) {
  const { loadRecentSummaries } = useWakapiDataContext()
  const queryKey = useMemo(() => getRecentQueryKey(days), [days])
  const load = useCallback(
    () => loadRecentSummaries(days),
    [days, loadRecentSummaries]
  )

  return useWakapiQuery(queryKey, load)
}

export function useWakapiYearSummaries(year: number) {
  const { loadYearSummaries } = useWakapiDataContext()
  const queryKey = useMemo(() => getYearQueryKey(year), [year])
  const load = useCallback(
    () => loadYearSummaries(year),
    [loadYearSummaries, year]
  )

  return useWakapiQuery(queryKey, load)
}
