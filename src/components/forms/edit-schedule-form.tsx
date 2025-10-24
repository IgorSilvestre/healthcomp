"use client";

import { useEffect, useMemo, useRef, useActionState } from "react";
import { updateScheduleAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import type { Schedule } from "@/lib/care-log";
import type { MedicationCatalogItem } from "@/lib/medications";
import { SubmitButton } from "@/components/forms/submit-button";
import Link from "next/link";
import { toAppDateInputValue, toAppDateTimeInputValue } from "@/lib/datetime";

export default function EditScheduleForm({
  schedule,
  medications = [] as MedicationCatalogItem[],
}: {
  schedule: Schedule;
  medications?: MedicationCatalogItem[];
}) {
  const [state, formAction] = useActionState(
    updateScheduleAction,
    defaultActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      // mantém dados para permitir múltiplas alterações; não limpar
    }
  }, [state.status]);

  const { freqValue, freqUnit } = useMemo(() => {
    const h = 3_600_000;
    if (schedule.frequencyMs % h === 0) {
      return {
        freqValue: schedule.frequencyMs / h,
        freqUnit: "hours",
      } as const;
    }
    return {
      freqValue: Math.max(1, Math.round(schedule.frequencyMs / 60_000)),
      freqUnit: "minutes",
    } as const;
  }, [schedule.frequencyMs]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl shadow-sky-100/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none"
    >
      <input type="hidden" name="scheduleId" value={schedule.id} />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Editar agendamento
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Atualize as informações do agendamento.
      </p>

      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Nome do medicamento
          {medications.length > 0 ? (
            <select
              required
              name="scheduleMedicationName"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
              defaultValue={schedule.medicationName}
            >
              <option value="" disabled>
                Selecione um medicamento
              </option>
              {medications.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.purpose})
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                required
                name="scheduleMedicationName"
                defaultValue={schedule.medicationName}
                placeholder="ex.: Acetaminofeno"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
              />
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                Dica: cadastre medicamentos em{" "}
                <a className="underline" href="/medicamentos">
                  Medicamentos
                </a>{" "}
                para selecionar aqui.
              </span>
            </>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Dosagem (opcional)
          <input
            name="scheduleDosage"
            defaultValue={schedule.dosage || ""}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Frequência
            <input
              required
              name="frequencyValue"
              type="number"
              min={1}
              defaultValue={freqValue}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Unidade
            <select
              name="frequencyUnit"
              defaultValue={freqUnit}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            >
              <option value="hours">hora</option>
              <option value="minutes">minuto</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Primeira Dose
            <input
              type="datetime-local"
              name="startAt"
              defaultValue={toAppDateTimeInputValue(schedule.startAt)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Prazo (opcional)
            <input
              type="date"
              name="endAt"
              defaultValue={
                schedule.endAt ? toAppDateInputValue(schedule.endAt) : ""
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Última dose tomada (opcional)
          <input
            type="datetime-local"
            name="lastTakenAt"
            defaultValue={
              schedule.lastTakenAt
                ? toAppDateTimeInputValue(schedule.lastTakenAt)
                : ""
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Notas (opcional)
          <textarea
            name="scheduleNotes"
            rows={3}
            defaultValue={schedule.notes || ""}
            placeholder="Adicione contexto como tomar com comida ou ficar atento a tonturas."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
      </div>

      {state.status !== "idle" && (
        <p
          className={`mt-3 text-sm ${
            state.status === "error"
              ? "text-rose-500"
              : "text-emerald-500 dark:text-emerald-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <SubmitButton label="Salvar alterações" />
        <Link
          href="/schedule"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
