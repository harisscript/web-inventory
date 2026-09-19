export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type ApiOptions = {
  baseUrl?: string
  headers?: Record<string, string>
}

export function createApiClient(options: ApiOptions = {}) {
  const baseUrl = options.baseUrl ?? ''

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${baseUrl}${path}`
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...init?.headers,
      },
    })
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new ApiError(text || response.statusText, response.status)
    }
    return response.json() as Promise<T>
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  }
}
