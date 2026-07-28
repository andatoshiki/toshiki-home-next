export const JOURNEY_STATUSES = [
  'visited',
  'residence',
  'airport',
  'wishlist'
] as const

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number]
export type JourneyStatusFilter = JourneyStatus | 'all'
export type JourneyStatusCounts = Record<JourneyStatusFilter, number>

export const JOURNEY_STATUS_DETAILS = {
  visited: {
    label: 'Visited',
    legendLabel: 'visited',
    summaryLabel: 'Places Visited',
    color: '#f59e0b',
    textClassName: 'text-amber-500'
  },
  residence: {
    label: 'Residence',
    legendLabel: 'residence',
    summaryLabel: 'Residences',
    color: '#3b82f6',
    textClassName: 'text-blue-500'
  },
  airport: {
    label: 'Airports',
    legendLabel: 'airport',
    summaryLabel: 'Airports',
    color: '#06b6d4',
    textClassName: 'text-cyan-500'
  },
  wishlist: {
    label: 'Wishlist',
    legendLabel: 'wishlist',
    summaryLabel: 'Wishlist',
    color: '#ec4899',
    textClassName: 'text-pink-500'
  }
} as const satisfies Record<
  JourneyStatus,
  {
    label: string
    legendLabel: string
    summaryLabel: string
    color: string
    textClassName: string
  }
>
