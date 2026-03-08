const RPC_ENDPOINT = 'https://ethereum-rpc.publicnode.com/'
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

/**
 * Fetch the USDT balance of an Ethereum address via public RPC.
 * Runs entirely on the server (safe for SSR / SSG).
 */
export async function fetchCryptoBalance(address: string): Promise<number> {
  if (!address) throw new Error('Missing address')

  // prepare encoded balanceOf(address)
  const methodSelector = '0x70a08231'
  const cleanAddr = address.toLowerCase().replace(/^0x/, '').padStart(64, '0')
  const data = methodSelector + cleanAddr

  const body = {
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [{ to: USDT_ADDRESS, data }, 'latest'],
    id: 1
  }

  const res = await fetch(RPC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
    // You can add cache control if needed:
    // cache: 'force-cache', next: { revalidate: 3600 }
  })

  if (!res.ok) throw new Error('RPC request failed')

  const json = await res.json()
  const raw = json?.result
  if (!raw || raw === '0x') return 0

  // USDT uses 6 decimals
  const balance = parseInt(raw, 16) / 1e6
  return Number(balance.toFixed(2))
}
