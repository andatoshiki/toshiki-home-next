const usdt_address =
  process.env.USDT_ADDRESS || '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const apiKey = process.env.ETHERSCAN_API_KEY
const endpoint = process.env.ETHERSCAN_API_ENDPOINT || 'api.etherscan.io'

export async function fetchCryptoBalance(address: string): Promise<number> {
  if (!address) throw new Error('Missing address')
  if (!apiKey) throw new Error('API key not set')
  const url = `https://${endpoint}/v2/api?chainid=1&module=account&action=tokenbalance&contractaddress=${usdt_address}&address=${address}&tag=latest&apikey=${apiKey}`
  const response = await fetch(url)
  const data = await response.json()
  const raw = data?.result?.balance || data?.result
  if (!raw) throw new Error('No balance found')
  const usdt = parseFloat(raw) / 1e6
  return Number(usdt.toFixed(2))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')
  if (!address) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid address' }),
      { status: 400 }
    )
  }
  try {
    const balance = await fetchCryptoBalance(address)
    return new Response(JSON.stringify({ balance }), { status: 200 })
  } catch (e: any) {
    if (e instanceof Error && e.message === 'No balance found') {
      return new Response(JSON.stringify({ error: e.message }), { status: 404 })
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch balance' }), {
      status: 500
    })
  }
}
