"use client";

import { useFormState } from "react-dom";
import { useRef, useEffect } from "react";
import { createCatalogMedication } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { PURPOSES } from "@/lib/constants";
import { SubmitButton } from "@/components/forms/submit-button";

export default function CatalogMedicationForm() {
  const [state, formAction] = useFormState(createCatalogMedication, defaultActionState);
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
      className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Adicionar medicamento ao catálogo</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Cadastre o nome e o propósito para usar nos formulários.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Nome
          <input
            required
            name="name"
            placeholder="ex.: Dipirona"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          Propósito
          <select
            required
            name="purpose"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-500/40"
          >
            <option value="" disabled selected>Selecione</option>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>
      {state.status !== "idle" && (
        <p className={`mt-3 text-sm ${state.status === "error" ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
          {state.message}
        </p>
      )}
      <div className="mt-4">
        <SubmitButton label="Salvar" />
      </div>
    </form>
  );
}
