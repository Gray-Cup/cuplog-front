import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// cache() deduplicates calls within a single request — layout, page, and any
// server components that call getUser all share one auth DB round-trip.
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const getUser = cache(async () => {
  const session = await getSession();
  return session?.user;
});