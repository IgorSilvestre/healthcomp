import { RestrictionForm } from "@/components/forms/restriction-form";
import { getRestrictions } from "@/lib/restrictions";
import { deleteRestriction as deleteRestrictionAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";
import Link from "next/link";

async function deleteRestriction(formData: FormData) {
  "use server";
  await deleteRestrictionAction(defaultActionState, formData);
}

export default async function RestrictionsPage() {
  const restrictions = await getRestrictions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Restrições</h1>
            <Link href="/restrictions/new" className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                Nova Restrição
            </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Lista</h2>
          {restrictions.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nenhuma restrição cadastrada ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
              {restrictions.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.titulo}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Categoria: {r.categoria === "alimento" ? "Alimento" : "Atividade"}</div>
                    {r.detalhes && (
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">{r.detalhes}</div>
                    )}
                  </div>
                  <form action={deleteRestriction} className="ml-3">
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      aria-label="Excluir"
                      title="Excluir"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-950"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5"
                      >
                        <title>Excluir restrição</title>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6m4-6v6" />
                      </svg>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
