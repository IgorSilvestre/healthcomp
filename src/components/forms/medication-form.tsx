"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createMedicationEntry } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando…" : label}
    </button>
  );
}

export function MedicationForm() {
  const [state, formAction] = useFormState(
    createMedicationEntry,
    defaultActionState,
  );
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
        Registrar medicamento
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Registre tudo o que foi administrado, incluindo observações opcionais.
      </p>
      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Nome do medicamento
          <input
            required
            name="medicationName"
            placeholder="ex.: Amoxicilina 500 mg"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Dosagem (opcional)
          <input
            name="dosage"
            placeholder="ex.: 5 ml"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Notas para o próximo cuidador (opcional)
          <textarea
            name="note"
            rows={3}
            placeholder="Mencione efeitos colaterais, reações ou lembretes."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Cuidador (opcional)
            <input
              name="author"
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Time given
            <input
              type="datetime-local"
              name="takenAt"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
            />
          </label>
        </div>
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
      <SubmitButton label="Add medication entry" />
    </form>
  );
}
