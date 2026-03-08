'use client'
import React from 'react'
import NumberFlow from '@number-flow/react'
import { SiTether } from 'react-icons/si'
import { fetchCryptoBalance } from '~/lib/api/crypto-rpc'

interface CryptoBalanceProps {
  address: string
}

export default function CryptoBalance({ address }: CryptoBalanceProps) {
  const [display, setDisplay] = React.useState<number>(0)

  React.useEffect(() => {
    let cancelled = false
    setDisplay(0)

    fetchCryptoBalance(address)
      .then(balance => {
        if (!cancelled) setDisplay(balance)
      })
      .catch(() => {
        if (!cancelled) setDisplay(0)
      })

    return () => {
      cancelled = true
    }
  }, [address])

  return (
    <span className="flex items-center gap-2">
      <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-base font-semibold text-green-700 dark:bg-neutral-900 dark:text-green-200">
        <NumberFlow value={display} />
        <SiTether className="h-4 w-4" />
        <span className="text-xs font-semibold">USDT</span>
      </span>
    </span>
  )
}
