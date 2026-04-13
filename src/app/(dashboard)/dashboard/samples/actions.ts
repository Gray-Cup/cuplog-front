"use server";

import { db } from "@/lib/db";
import { sample } from "@/lib/db/schema";
import { getUser } from "@/lib/auth-utils";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SampleRow = typeof sample.$inferSelect;

export async function getSamples(): Promise<SampleRow[]> {
  const user = await getUser();
  if (!user) return [];
  return db
    .select()
    .from(sample)
    .where(eq(sample.userId, user.id))
    .orderBy(desc(sample.createdAt));
}

export async function createSample(data: {
  name: string;
  origin: string;
  variety: string;
  process: string;
  roast: string;
  photos: string[];
}): Promise<SampleRow> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const now = new Date();
  const [row] = await db
    .insert(sample)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      name: data.name.trim(),
      origin: data.origin.trim() || "—",
      variety: data.variety.trim() || "—",
      process: data.process.trim() || "—",
      roast: data.roast.trim() || "—",
      dateReceived: now.toISOString().slice(0, 10),
      status: "pending",
      photos: data.photos,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  revalidatePath("/dashboard/samples");
  revalidatePath("/dashboard");
  return row;
}

export async function saveCuppingSession(
  id: string,
  scores: {
    fragrance: string;
    flavor: string;
    aftertaste: string;
    acidity: string;
    body: string;
    balance: string;
    overall: string;
    uniformity: string;
    cleanCup: string;
    sweetness: string;
    taints: string;
    faults: string;
    notes: string;
  },
  finalScore: number
): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(sample)
    .set({
      ...scores,
      finalScore: String(finalScore),
      status: "complete",
      updatedAt: new Date(),
    })
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidatePath("/dashboard/samples");
  revalidatePath("/dashboard");
}

export async function updateSamplePhotos(
  id: string,
  photos: string[]
): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .update(sample)
    .set({ photos, updatedAt: new Date() })
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidatePath("/dashboard/samples");
}

export async function deleteSample(id: string): Promise<void> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .delete(sample)
    .where(and(eq(sample.id, id), eq(sample.userId, user.id)));

  revalidatePath("/dashboard/samples");
  revalidatePath("/dashboard");
}
