import {
  SiBitcoin,
  SiEthereum,
  SiTether,
  SiBinance,
  SiLitecoin,
  SiDogecoin,
  SiSolana,
  SiCardano,
  SiPolkadot,
  SiMonero,
  SiRipple,
  SiChainlink
} from 'react-icons/si'
import React from 'react'

const iconMap: Record<string, React.ReactNode> = {
  Bitcoin: <SiBitcoin className="h-7 w-7" />,
  Ethereum: <SiEthereum className="h-7 w-7" />,
  USDT: <SiTether className="h-7 w-7" />,
  BNB: <SiBinance className="h-7 w-7" />,
  Litecoin: <SiLitecoin className="h-7 w-7" />,
  Dogecoin: <SiDogecoin className="h-7 w-7" />,
  Solana: <SiSolana className="h-7 w-7" />,
  Cardano: <SiCardano className="h-7 w-7" />,
  Polkadot: <SiPolkadot className="h-7 w-7" />,
  Monero: <SiMonero className="h-7 w-7" />,
  Ripple: <SiRipple className="h-7 w-7" />,
  Chainlink: <SiChainlink className="h-7 w-7" />
}

export function CryptoCard({
  icon,
  name,
  chain,
  address,
  revealed,
  onReveal
}: {
  icon: keyof typeof iconMap
  name: string
  chain: string
  address: string
  revealed: boolean
  onReveal: () => void
}) {
  return (
    <div className="flex max-w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 text-2xl font-semibold text-neutral-500 dark:bg-neutral-900">
        {iconMap[icon]}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {chain}
        </span>
        <span
          className={`mt-1 break-all text-xs text-neutral-500 dark:text-neutral-400 ${!revealed ? 'cursor-pointer select-none hover:underline' : ''}`}
          onClick={() => !revealed && onReveal()}
        >
          {revealed ? (
            <pre className="m-0 whitespace-pre-wrap break-all bg-transparent p-0 font-mono">
              {address}
            </pre>
          ) : (
            'Click to Reveal'
          )}
        </span>
      </div>
    </div>
  )
}
