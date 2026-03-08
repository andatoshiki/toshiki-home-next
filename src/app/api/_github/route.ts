import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const username = process.env.GITHUB_USERNAME || 'andatoshiki'
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing GITHUB_TOKEN in env' }),
        { status: 500 }
      )
    }
    if (!start || !end) {
      return new Response(
        JSON.stringify({ error: 'Missing start or end date' }),
        { status: 400 }
      )
    }
    const query = {
      query: `
        query userInfo($LOGIN: String!, $FROM: DateTime!, $TO: DateTime!) {
          user(login: $LOGIN) {
            contributionsCollection(from: $FROM, to: $TO) {
              contributionCalendar {
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        LOGIN: username,
        FROM: `${start}T00:00:00Z`,
        TO: `${end}T23:59:59Z`
      }
    }
    const ghRes = await fetch('https://gh-api.toshiki.dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(query)
    })
    if (!ghRes.ok) {
      const text = await ghRes.text()
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${ghRes.status} ${text}` }),
        { status: 500 }
      )
    }
    const apiResponse = await ghRes.json()
    const weeks =
      apiResponse.data?.user?.contributionsCollection?.contributionCalendar
        ?.weeks || []
    const contributions: {
      date: string
      grand_total: { total_seconds: number }
    }[] = []
    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions.push({
          date: day.date,
          grand_total: { total_seconds: day.contributionCount * 60 }
        })
      })
    })
    return Response.json({ data: contributions })
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.toString() }), {
      status: 500
    })
  }
}
