// ./src/lib/safeFetch.ts
export type SafeFetchJSONResult<T = unknown> = {
  ok: boolean;
  status: number;
  json: T | null;
  text: string;
};

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
    // non-JSON response — leave json as null
  }
  return { ok: res.ok, status: res.status, json, text };
}
