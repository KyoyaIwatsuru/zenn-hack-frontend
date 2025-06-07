export async function apiClient(
  path: string,
  opts: RequestInit = {}
): Promise<unknown> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}${path}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...opts.headers,
      },
      ...opts,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    const err = new Error(errorText || `HTTP ${res.status}`);
    throw err;
  }

  return res.json();
}
