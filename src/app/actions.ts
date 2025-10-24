"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { addHistoryEntry, addSchedule, markDoseTaken, getScheduleById, updateSchedule, deleteSchedule } from "@/lib/care-log";
import { addMedicationToCatalog, deleteMedicationFromCatalog, type Purpose } from "@/lib/medications";

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
      message: "Nome do medicamento é obrigatório.",
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
    message: "Medicação registrada no histórico.",
  };
}

export async function createCatalogMedication(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const purpose = formData.get("purpose")?.toString().trim() as Purpose | undefined;
  if (!name) {
    return { status: "error", message: "Nome do medicamento é obrigatório." };
  }
  if (!purpose) {
    return { status: "error", message: "Selecione um propósito." };
  }
  try {
    await addMedicationToCatalog({ name, purpose });
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Não foi possível adicionar o medicamento." };
  }
  revalidatePath("/medicamentos");
  revalidatePath("/medication");
  revalidatePath("/schedule");
  return { status: "success", message: "Medicamento adicionado ao catálogo." };
}

export async function deleteCatalogMedication(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  if (!id) return { status: "error", message: "ID inválido." };
  try {
    await deleteMedicationFromCatalog(id);
  } catch {
    return { status: "error", message: "Não foi possível excluir." };
  }
  revalidatePath("/medicamentos");
  revalidatePath("/medication");
  revalidatePath("/schedule");
  return { status: "success", message: "Excluído." };
}

export async function createCommentEntry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const message = formData.get("message")?.toString().trim() ?? "";
  if (!message) {
    return {
      status: "error",
      message: "Escreva um comentário breve antes de enviar.",
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
      message: "Nome do medicamento é obrigatório para um agendamento.",
    };
  }

  const frequencyRaw = Number(
    formData.get("frequencyValue")?.toString().trim() ?? "",
  );
  if (!Number.isFinite(frequencyRaw) || frequencyRaw <= 0) {
    return {
      status: "error",
      message: "Informe com que frequência o medicamento deve ser administrado.",
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
    message: "Agendamento adicionado.",
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
      message: "Faltam informações do agendamento.",
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
        error instanceof Error ? error.message : "Não foi possível registrar a dose.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Dose registrada no histórico.",
  };
}

export async function updateScheduleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("scheduleId")?.toString();
  if (!id) {
    return { status: "error", message: "Agendamento não encontrado." };
  }

  const existing = await getScheduleById(id);
  if (!existing) {
    return { status: "error", message: "Agendamento não existe." };
  }

  const medicationName =
    formData.get("scheduleMedicationName")?.toString().trim() ?? existing.medicationName;
  if (!medicationName) {
    return { status: "error", message: "Nome do medicamento é obrigatório." };
  }

  const frequencyRaw = Number(
    formData.get("frequencyValue")?.toString().trim() ?? ""
  );
  const frequencyUnit =
    formData.get("frequencyUnit")?.toString().trim() || "hours";
  const multiplier = frequencyUnit === "minutes" ? 60_000 : 3_600_000;
  const frequencyMs = Number.isFinite(frequencyRaw) && frequencyRaw > 0
    ? frequencyRaw * multiplier
    : existing.frequencyMs;

  const startAt = formData.get("startAt")
    ? parseDateInput(formData.get("startAt"))
    : existing.startAt;

  const endAtEntry = formData.get("endAt");
  let endAt: number | undefined = existing.endAt;
  if (endAtEntry !== null) {
    const raw = endAtEntry.toString().trim();
    if (!raw) {
      endAt = undefined;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const [y, m, d] = raw.split("-").map((v) => Number(v));
      endAt = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    } else {
      endAt = parseDateInput(endAtEntry);
    }
  }

  if (endAt !== undefined && endAt < startAt) {
    return {
      status: "error",
      message: "O prazo deve ser no mesmo dia ou após a primeira dose.",
    };
  }

  const dosage = formData.get("scheduleDosage")?.toString().trim();
  const notes = formData.get("scheduleNotes")?.toString().trim();

  const lastTakenAtEntry = formData.get("lastTakenAt");
  const lastTakenAt = lastTakenAtEntry && lastTakenAtEntry.toString().trim()
    ? parseDateInput(lastTakenAtEntry)
    : undefined;

  await updateSchedule({
    ...existing,
    medicationName,
    dosage: dosage || undefined,
    frequencyMs,
    startAt,
    endAt,
    lastTakenAt: lastTakenAt ?? existing.lastTakenAt,
    notes: notes && notes.length ? notes : existing.notes,
  });

  revalidatePath("/schedule");
  revalidatePath("/");

  return { status: "success", message: "Agendamento atualizado." };
}

export async function deleteScheduleAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("scheduleId")?.toString();
  if (!id) {
    return { status: "error", message: "Agendamento não encontrado." };
  }

  await deleteSchedule(id);
  revalidatePath("/schedule");
  revalidatePath("/");
  return { status: "success", message: "Agendamento excluído." };
}
