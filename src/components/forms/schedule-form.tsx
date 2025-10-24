"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createSchedule } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 w-full rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : "Create schedule"}
    </button>
  );
}

export function ScheduleForm() {
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
      className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl shadow-emerald-100/50 backdrop-blur dark:border-emerald-400/20 dark:bg-slate-900/60 dark:shadow-none"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Adicione agendamento de medicamento
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Defina doses recorrentes para ficarem agendadas
      </p>
      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Nome Medicamento
          <input
            required
            name="scheduleMedicationName"
            placeholder="e.g. Acetaminophen"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Dosagem (opcional)
          <input
            name="scheduleDosage"
            placeholder="e.g. 1 pill"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
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
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Unidade
            <select
              name="frequencyUnit"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            >
              <option value="hours">hora</option>
              <option value="minutes">minuto</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Primeira dose (Padrão é agora)
            <input
              type="datetime-local"
              name="startAt"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            última vez tomado (opcional)
            <input
              type="datetime-local"
              name="lastTakenAt"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Notas (opcional)
          <textarea
            name="scheduleNotes"
            rows={3}
            placeholder="Add context like take with food or watch for dizziness."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/40"
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
      <SubmitButton />
    </form>
  );
}
