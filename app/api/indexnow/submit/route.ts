import { NextResponse } from "next/server";
import { getAllSiteUrls } from "@/lib/site-urls";
import { submitUrlsToIndexNow } from "@/lib/indexnow";

// Triggered daily by Vercel Cron (see vercel.json). Resubmitting the same
// URLs on every run is harmless per the IndexNow spec — there's no
// publish-time webhook from Sanity or BabyLoveGrowth to trigger this
// on-demand, so a periodic full resubmit is what keeps both content
// sources' new/changed URLs flowing to Bing/Yandex without added state.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const entries = await getAllSiteUrls();
  const result = await submitUrlsToIndexNow(entries.map((e) => e.url));

  return NextResponse.json({ submittedCount: entries.length, result });
}
