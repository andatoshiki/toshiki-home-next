'use client'
import { Title } from '~/components/title'
import { CryptoCard } from '~/components/crypto-card'
// import CryptoBalance from '~/components/crypto-balance'
import CryptoBalance from '~/components/ui/usdt-balance'
import { useState } from 'react'
import { MDXContent } from '~/components/mdx-content'
import { donation } from '#content'

const accounts = [
  {
    icon: 'Bitcoin',
    name: 'Bitcoin',
    chain: 'Bitcoin',
    address: 'bc1qkjdt4w2930yd0dgyxnxsw3v3hssggdv8eg768m'
  },
  {
    icon: 'Ethereum',
    name: 'Ethereum',
    chain: 'Ethereum',
    address: '0xe05FFEADb3b9E1f376dD1180A7A30C13D1cC153d'
  },
  {
    icon: 'USDT',
    name: 'Tether USDT',
    chain: 'Ethereum',
    address: '0x2ab06c88ed3af0070d85e1470eff88fb3b9a1f97'
  },
  {
    icon: 'BNB',
    name: 'BNB',
    chain: 'BNB Smart Chain',
    address: '0xe05FFEADb3b9E1f376dD1180A7A30C13D1cC153d'
  }
]

export default function DonationPage() {
  return (
    <div className="content-container content-vertical-spaces m-auto space-y-12 overflow-hidden">
      <div className="sm-center-balance flex flex-col gap-2 md:flex-col md:items-center lg:flex-row lg:items-end lg:justify-between">
        <Title text="Donation" />
        <CryptoBalance address="0x1060d8d8a9a1Ec477fdeE79215d5136a9dAC2C20" />
      </div>
      <div className="about-rendered-mdx my-5 flex flex-col gap-3 text-xl md:text-left">
        <MDXContent code={donation.content} />
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {accounts.map(account => (
          <CryptoCardWithReveal key={account.name} {...account} />
        ))}
      </div>
    </div>
  )
}

function CryptoCardWithReveal(props: {
  icon: string
  name: string
  chain: string
  address: string
}) {
  const [revealed, setRevealed] = useState(false)
  return (
    <CryptoCard
      icon={props.icon as any}
      name={props.name}
      chain={props.chain}
      address={props.address}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
    />
  )
}
