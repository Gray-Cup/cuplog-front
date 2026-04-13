"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserImage(imageUrl: string): Promise<void> {
  await auth.api.updateUser({
    headers: await headers(),
    body: { image: imageUrl },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}
