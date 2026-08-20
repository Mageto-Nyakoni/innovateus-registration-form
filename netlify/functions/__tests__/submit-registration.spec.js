// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import submitRegistration from '../submit-registration.mjs'

const validRegistration = {
  first_name: 'Ada',
  last_name: 'Lovelace',
  email: 'ada@example.com',
  country: 'United States',
  state: 'IL',
  gov_org: "Yes, I'm an employee of a government agency",
  gov_level: 'National or Federal Level',
  workshop_series: 'Practical Approaches to Evaluating AI for Public Benefit',
  newsletter: false
}

function request(body, method = 'POST') {
  const options = { method }

  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  return new Request('http://localhost/.netlify/functions/submit-registration', options)
}

describe('submit-registration Netlify function', () => {
  beforeEach(() => {
    vi.stubEnv('DIRECTUS_TOKEN', 'test-directus-token')
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('rejects non-POST requests', async () => {
    const response = await submitRegistration(request(undefined, 'GET'))

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('POST')
    await expect(response.json()).resolves.toEqual({ error: 'Method not allowed.' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects invalid JSON', async () => {
    const response = await submitRegistration(request('{invalid json'))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid request payload.' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects missing required fields', async () => {
    const response = await submitRegistration(request({ newsletter: false }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error:
        'Missing required fields: first_name, last_name, email, country, gov_org, workshop_series'
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('rejects a non-boolean newsletter preference', async () => {
    const response = await submitRegistration(
      request({ ...validRegistration, newsletter: 'false' })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Newsletter preference must be a boolean.'
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without calling Directus', async () => {
    const response = await submitRegistration(request({ website: 'https://spam.example' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 502 when Directus responds with a non-OK status', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch.mockResolvedValue({
      ok: false,
      status: 422,
      text: vi.fn().mockResolvedValue('Validation failed')
    })

    const response = await submitRegistration(request(validRegistration))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'Unable to submit registration right now.'
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('returns 502 when the Directus request rejects', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch.mockRejectedValue(new Error('Connection refused'))

    const response = await submitRegistration(request(validRegistration))

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'Unable to submit registration right now.'
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
