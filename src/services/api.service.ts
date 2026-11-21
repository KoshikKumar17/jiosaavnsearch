import { getConfig } from '../configs/index.js'
import { HttpExceptionError } from '../exceptions/http.exception.js'
import type { Config } from '../configs/index.js'

export class ApiService {
  private baseURL: Config['baseURL']
  protected endpoints: Config['endpoint']

  constructor() {
    const { baseURL, endpoint } = getConfig()
    this.baseURL = baseURL
    this.endpoints = endpoint
  }

  protected async http<T>(url: string, isVersion4: boolean, query?: Record<string, string | number | undefined>): Promise<T> {
    const params = new URLSearchParams([
      ['_format', 'json'],
      ['_marker', '0'],
      ['ctx', 'web6dot0'],
      ['__call', url],
    ])
    if (isVersion4) params.set('api_version', '4')
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== null) params.set(k, String(v))
    }

    const language = (query?.language as string) || 'english'

    const res = await fetch(`${this.baseURL}?${params.toString()}`, {
      headers: {
        cookie: `L=${encodeURIComponent(language)}; gdpr_acceptance=true; DL=english`,
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        accept: 'application/json, text/plain, */*',
      },
    })

    const text = await res.text()
    if (!res.ok) throw new HttpExceptionError(503, `upstream returned ${res.status}: ${text.slice(0, 120)}`)

    try {
      return JSON.parse(text) as T
    } catch {
      throw new HttpExceptionError(503, `upstream returned non-JSON response: ${text.slice(0, 120)}`)
    }
  }
}
