"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { addHistoryEntry, addSchedule, markDoseTaken } from "@/lib/care-log";

function parseDateInput(value: FormDataEntryValue | null) {
  if (!value) return Date.now();
  const stringValue = value.toString();
  if (!stringValue) return Date.now();
  const parsed = new Date(stringValue).getTime();
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export async function createMedicationEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const medicationName =
    formData.get("medicationName")?.toString().trim() ?? "";
  if (!medicationName) {
    return {
      status: "error",
      message: "Medication name is required.",
    };
  }

  const createdAt = parseDateInput(formData.get("takenAt"));
  const dosage = formData.get("dosage")?.toString().trim() || undefined;
  const note = formData.get("note")?.toString().trim() || undefined;
  const author = formData.get("author")?.toString().trim() || undefined;

  await addHistoryEntry({
    type: "medication",
    medicationName,
    dosage,
    note,
    author,
    createdAt,
  });
  revalidatePath("/");
  return {
    status: "success",
    message: "Medication added to history.",
  };
}

export async function createCommentEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const message = formData.get("message")?.toString().trim() ?? "";
  if (!message) {
    return {
      status: "error",
      message: "Please write a brief comment before submitting.",
    };
  }
  const createdAt = parseDateInput(formData.get("createdAt"));
  const author = formData.get("author")?.toString().trim() || undefined;

  await addHistoryEntry({
    type: "comment",
    message,
    author,
    createdAt,
  });
  revalidatePath("/");
  return {
    status: "success",
    message: "Comment added to history.",
  };
}

export async function createSchedule(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const medicationName =
    formData.get("scheduleMedicationName")?.toString().trim() ?? "";
  if (!medicationName) {
    return {
      status: "error",
      message: "Medication name is required for a schedule.",
    };
  }

  const frequencyRaw = Number(
    formData.get("frequencyValue")?.toString().trim() ?? "",
  );
  if (!Number.isFinite(frequencyRaw) || frequencyRaw <= 0) {
    return {
      status: "error",
      message: "Please provide how often the medication should be taken.",
    };
  }

  const frequencyUnit =
    formData.get("frequencyUnit")?.toString().trim() || "hours";
  const multiplier = frequencyUnit === "minutes" ? 60_000 : 3_600_000;
  const frequencyMs = frequencyRaw * multiplier;
  const startAt = parseDateInput(formData.get("startAt"));
  const endAtEntry = formData.get("endAt");
  let endAt: number | undefined = undefined;
  if (endAtEntry) {
    const raw = endAtEntry.toString().trim();
    if (raw) {
      // If the input is a date-only (YYYY-MM-DD), interpret it as local end-of-day
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        const [y, m, d] = raw.split("-").map((v) => Number(v));
        const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
        endAt = endOfDay;
      } else {
        // Fallback: parse full datetime
        endAt = parseDateInput(endAtEntry);
      }
    }
  }

  if (endAt !== undefined && endAt < startAt) {
    return {
      status: "error",
      message: "Deadline day must be on or after the start date.",
    };
  }

  const dosage = formData.get("scheduleDosage")?.toString().trim() || undefined;
  const notes = formData.get("scheduleNotes")?.toString().trim() || undefined;

  const lastTakenAtEntry = formData.get("lastTakenAt");
  const lastTakenAt = lastTakenAtEntry
    ? parseDateInput(lastTakenAtEntry)
    : undefined;

  await addSchedule({
    medicationName,
    dosage,
    frequencyMs,
    startAt,
    endAt,
    lastTakenAt,
    notes,
  });

  revalidatePath("/");

  return {
    status: "success",
    message: "Schedule added.",
  };
}

export async function logDose(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const scheduleId = formData.get("scheduleId")?.toString();
  if (!scheduleId) {
    return {
      status: "error",
      message: "Missing schedule information.",
    };
  }

  const takenAt = parseDateInput(formData.get("takenAt"));
  const author = formData.get("author")?.toString().trim() || undefined;
  const note = formData.get("note")?.toString().trim() || undefined;

  try {
    await markDoseTaken(scheduleId, takenAt, { author, note });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unable to record the dose.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Dose logged to history.",
  };
}
