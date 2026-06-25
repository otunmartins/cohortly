"use server";

import { z } from "zod";
import type { ActionResult } from "@/types/action";

const RunFeasibilityInput = z.object({
  projectId: z.string().min(1),
  scenario: z.record(z.string(), z.number()),
});

const LockBaselineInput = z.object({
  projectId: z.string().min(1),
  scenario: z.record(z.string(), z.number()),
});

const DuplicateScenarioInput = z.object({
  projectId: z.string().min(1),
});

export async function runFeasibility(
  raw: z.infer<typeof RunFeasibilityInput>,
): Promise<ActionResult<{ runId: string }>> {
  try {
    const input = RunFeasibilityInput.parse(raw);
    void input;
    // Stub: in production this enqueues a Monte-Carlo job via POST /api/feasibility/simulate
    // and writes a FeasibilityRun + AuditEvent to the DB.
    return { success: true, data: { runId: `run_${Date.now()}` } };
  } catch (err) {
    console.error("runFeasibility failed", err);
    return { success: false, error: "Could not start simulation." };
  }
}

export async function lockBaseline(
  raw: z.infer<typeof LockBaselineInput>,
): Promise<ActionResult<{ runId: string }>> {
  try {
    const input = LockBaselineInput.parse(raw);
    void input;
    // Stub: marks a FeasibilityRun as isBaseline = true + emits AuditEvent.
    return { success: true, data: { runId: `run_${Date.now()}` } };
  } catch (err) {
    console.error("lockBaseline failed", err);
    return { success: false, error: "Could not lock baseline." };
  }
}

export async function duplicateScenario(
  raw: z.infer<typeof DuplicateScenarioInput>,
): Promise<ActionResult<{ runId: string }>> {
  try {
    const input = DuplicateScenarioInput.parse(raw);
    void input;
    // Stub: clones the current FeasibilityRun + emits AuditEvent.
    return { success: true, data: { runId: `run_${Date.now()}` } };
  } catch (err) {
    console.error("duplicateScenario failed", err);
    return { success: false, error: "Could not duplicate scenario." };
  }
}
