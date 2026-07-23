import { INDEXNOW_KEY, SITE_URL } from "@/lib/constants";

// Generic endpoint — submitting here propagates to all participating
// engines (Bing, Yandex, Seznam, Naver); Google doesn't support IndexNow.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function submitUrlsToIndexNow(urls: string[]) {
  if (urls.length === 0) return { skipped: true as const };

  const host = new URL(SITE_URL).host;
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  return { skipped: false as const, status: res.status, ok: res.ok };
}
