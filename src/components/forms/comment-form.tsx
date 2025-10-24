"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createCommentEntry } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";

export function CommentForm() {
  const [state, formAction] = useFormState(
    createCommentEntry,
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
        Deixe um comentário
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Compartilhe observações, feedback do paciente ou lembretes para o próximo turno.
      </p>
      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Cuidador (opcional)
          <input
            name="author"
            placeholder="Seu nome"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Horário
          <input
            type="datetime-local"
            name="createdAt"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Comentário
          <textarea
            required
            name="message"
            rows={4}
            placeholder="O paciente descansou bem, sem febre. Lembre-se de verificar a hidratação."
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
      <SubmitButton label="Adicionar comentário" />
    </form>
  );
}
