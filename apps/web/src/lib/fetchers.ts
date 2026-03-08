// ./src/lib/fetchers.ts

export type SafeFetchJSONResult<T = unknown> = {
  ok: boolean;
  status: number;
  json: T | null;
  text: string;
};

/**
 * Read a fetch response and attempt to parse JSON.
 * Returns a typed SafeFetchJSONResult<T>.
 */
export async function safeFetchJSON<T = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<SafeFetchJSONResult<T>> {
  const res = await fetch(input, init);
  const text = await res.text().catch(() => "");
  let json: T | null = null;
  try {
    json = text ? (JSON.parse(text) as T) : null;
  } catch {
    // ignore JSON parse errors; json remains null
  }
  return { ok: res.ok, status: res.status, json, text };
}

export const sleep = (ms: number): Promise<void> =>
  new Promise<void>((r) => setTimeout(r, ms));

/**
 * Lightweight exponential-backoff fetch wrapper.
 * Returns the Response object (whether ok or not) unless it throws after exhausting retries.
 */
export async function fetchWithBackoff(
  url: string,
  opts: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, opts);
      // If response is ok or not retriable, return it
      if (res.ok) return res;
      if (![429].includes(res.status) && !(res.status >= 500 && res.status < 600)) {
        return res;
      }
      if (attempt >= maxRetries) return res;
    } catch (e: unknown) {
      // If we've exhausted retries, rethrow the last caught error
      if (attempt >= maxRetries) {
        throw e;
      }
      // Otherwise continue to retry
    }

    attempt++;
    // exponential backoff delay (300ms * 2^attempt)
    await sleep(300 * Math.pow(2, attempt));
  }
}
