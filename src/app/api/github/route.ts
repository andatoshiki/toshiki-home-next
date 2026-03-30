import { fetchGithubSnapshot } from '~/lib/api/github-server'

export const dynamic = 'force-dynamic'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Failed to fetch GitHub data'
}

export async function GET() {
  try {
    const snapshot = await fetchGithubSnapshot()

    return Response.json(snapshot)
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
