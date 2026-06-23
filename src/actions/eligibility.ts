"use server";

import { z } from "zod";
import type { ActionResult } from "@/types/action";

const UpdateCriterionInput = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  text: z.string().min(1),
  feasibility: z.number().int().min(0).max(100),
});

const AddCriterionInput = z.object({
  projectId: z.string().min(1),
  kind: z.enum(["INCLUSION", "EXCLUSION"]),
  text: z.string().min(1),
});

const RemoveCriterionInput = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
});

export async function updateCriterion(
  raw: z.infer<typeof UpdateCriterionInput>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const input = UpdateCriterionInput.parse(raw);
    // Stub: in production, validate tenant scope, write to DB, emit AuditEvent in same tx
    console.log("updateCriterion", input);
    return { success: true, data: { id: input.id } };
  } catch {
    return { success: false, error: "Could not update criterion." };
  }
}

export async function addCriterion(
  raw: z.infer<typeof AddCriterionInput>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const input = AddCriterionInput.parse(raw);
    // Stub: in production, validate tenant scope, write to DB, emit AuditEvent in same tx
    console.log("addCriterion", input);
    const newId = `${input.kind === "INCLUSION" ? "I" : "E"}${Date.now()}`;
    return { success: true, data: { id: newId } };
  } catch {
    return { success: false, error: "Could not add criterion." };
  }
}

export async function removeCriterion(
  raw: z.infer<typeof RemoveCriterionInput>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const input = RemoveCriterionInput.parse(raw);
    // Stub: in production, validate tenant scope, soft-delete, emit AuditEvent in same tx
    console.log("removeCriterion", input);
    return { success: true, data: { id: input.id } };
  } catch {
    return { success: false, error: "Could not remove criterion." };
  }
}
