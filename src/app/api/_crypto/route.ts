import { fetchCryptoBalance } from '~/lib/api/crypto-etherscan'

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
