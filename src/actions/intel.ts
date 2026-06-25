"use server";

import type { ActionResult } from "@/types/action";

export async function configureAlerts(): Promise<ActionResult<null>> {
  return { success: true, data: null };
}

export async function exportLandscapeReport(): Promise<ActionResult<null>> {
  return { success: true, data: null };
}
