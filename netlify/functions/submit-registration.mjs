const DIRECTUS_URL = (process.env.DIRECTUS_URL || 'https://burnes-center.directus.app').replace(
  /\/+$/,
  ''
)

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function buildDirectusPayload(body) {
  const firstName = normalizeText(body.first_name)
  const lastName = normalizeText(body.last_name)
  const email = normalizeText(body.email)
  const country = normalizeText(body.country)
  const govOrg = normalizeText(body.gov_org)
  const workshopSeries = Array.isArray(body.workshop_series)
    ? body.workshop_series.map(normalizeText).filter(Boolean).join(', ')
    : normalizeText(body.workshop_series)

  if (typeof body.newsletter !== 'boolean') {
    return { error: 'Newsletter preference must be a boolean.' }
  }

  const missingFields = [
    ['first_name', firstName],
    ['last_name', lastName],
    ['email', email],
    ['country', country],
    ['gov_org', govOrg],
    ['workshop_series', workshopSeries]
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field)

  if (missingFields.length > 0) {
    return { error: `Missing required fields: ${missingFields.join(', ')}` }
  }

  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    country,
    gov_org: govOrg,
    workshop_series: workshopSeries,
    newsletter: body.newsletter
  }

  const state = normalizeText(body.state)
  if (country === 'United States' && state) {
    payload.state = state
  }

  const govLevel = normalizeText(body.gov_level)
  if (govOrg.startsWith('Yes') && govLevel) {
    payload.gov_level = govLevel
  }

  const workshops = normalizeText(body.workshops)
  if (workshops) {
    payload.workshops = workshops
  }

  return { payload }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: {
        Allow: 'POST',
        'Content-Type': 'application/json'
      }
    })
  }

  if (!process.env.DIRECTUS_TOKEN) {
    console.error('DIRECTUS_TOKEN is not configured for submit-registration.')
    return json({ error: 'Server configuration error.' }, 500)
  }

  let body

  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid request payload.' }, 400)
  }

  if (normalizeText(body?.website)) {
    return json({ ok: true }, 200)
  }

  const { payload, error } = buildDirectusPayload(body || {})

  if (error) {
    return json({ error }, 400)
  }

  try {
    const response = await fetch(`${DIRECTUS_URL}/items/cw_intake`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const directusError = await response.text()
      console.error('Directus submission failed.', response.status, directusError)
      return json({ error: 'Unable to submit registration right now.' }, 502)
    }

    return json({ ok: true }, 200)
  } catch (submissionError) {
    console.error('Directus submission request failed.', submissionError)
    return json({ error: 'Unable to submit registration right now.' }, 502)
  }
}
