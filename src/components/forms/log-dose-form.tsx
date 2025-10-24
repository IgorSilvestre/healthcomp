"use client";

import { useEffect, useRef, useActionState } from "react";
import { logDose } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";

export function LogDoseForm({
  scheduleId,
  disabled,
}: {
  scheduleId: string;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState(logDose, defaultActionState);
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
      className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/90 p-4 text-sm text-slate-700 shadow-xl shadow-sky-100/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200 dark:shadow-none"
    >
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="author"
          placeholder="Nome do cuidador"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
        />
        <input
          name="note"
          placeholder="Observação (opcional)"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
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
      <SubmitButton label="Registrar esta dose" disabled={disabled} />
      {disabled && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Este botão é ativado quando a janela da próxima dose estiver próxima.
        </p>
      )}
    </form>
  );
}
