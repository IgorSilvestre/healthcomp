"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createSchedule } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";

import type { MedicationCatalogItem } from "@/lib/medications";

export function ScheduleForm({ medications = [] as MedicationCatalogItem[] }: { medications?: MedicationCatalogItem[] }) {
  const [state, formAction] = useFormState(createSchedule, defaultActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl shadow-sky-100/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Adicione agendamento de medicamento
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Defina doses recorrentes para ficarem agendadas
      </p>
      <div className="mt-4 space-y-3">
            <label htmlFor="scheduleMedicationName" className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              Nome do medicamento
              {medications.length > 0 ? (
                <select
                  required
                  id="scheduleMedicationName"
                  name="scheduleMedicationName"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
                  defaultValue=""
                >
                  <option value="" disabled>Selecione um medicamento</option>
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
                    id="scheduleMedicationName"
                    name="scheduleMedicationName"
                    placeholder="ex.: Acetaminofeno"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
                  />
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Dica: cadastre medicamentos em <a className="underline" href="/medicamentos">Medicamentos</a> para selecionar aqui.</span>
                </>
              )}
            </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Dosagem (opcional)
          <input
            name="scheduleDosage"
            placeholder="e.g. 1 capsula"
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
              placeholder="e.g. 8"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Unidade
            <select
              name="frequencyUnit"
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
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Prazo (opcional)
            <input
              type="date"
              name="endAt"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Notas (opcional)
          <textarea
            name="scheduleNotes"
            rows={3}
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
      <SubmitButton label="Adicionar Agendamento" />
    </form>
  );
}
