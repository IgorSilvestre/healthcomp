"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { logDose } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-200"
    >
      {pending ? "Registrando…" : "Registrar esta dose"}
    </button>
  );
}

export function LogDoseForm({
  scheduleId,
  disabled,
}: {
  scheduleId: string;
  disabled?: boolean;
}) {
  const [state, formAction] = useFormState(logDose, defaultActionState);
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
      className="mt-4 space-y-3 rounded-xl border border-sky-200/60 bg-sky-50/70 p-3 text-sm text-slate-700 dark:border-sky-700/60 dark:bg-sky-900/40 dark:text-slate-200"
    >
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="author"
          placeholder="Nome do cuidador"
          className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-sky-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-600/40"
        />
        <input
          name="note"
          placeholder="Observação (opcional)"
          className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-sky-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-600/40"
        />
      </div>
      {state.status === "error" && (
        <p className="text-xs text-rose-500">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400">
          Dose registrada.
        </p>
      )}
      <SubmitButton disabled={disabled} />
      {disabled && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Este botão é ativado quando a janela da próxima dose estiver próxima.
        </p>
      )}
    </form>
  );
}
