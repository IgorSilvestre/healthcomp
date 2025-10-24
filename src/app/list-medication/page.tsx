import CatalogMedicationForm from "@/components/forms/catalog-medication-form";
import { getMedications } from "@/lib/medications";
import { deleteCatalogMedication as deleteCatalogMedicationAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { SubmitButton } from "@/components/forms/submit-button";

async function deleteMedication(formData: FormData) {
  "use server";
  await deleteCatalogMedicationAction(defaultActionState, formData);
}

export default async function MedicamentosPage() {
  const medications = await getMedications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Medicamentos (catálogo)</h1>
        </div>

        <CatalogMedicationForm />

        <section className="rounded-2xl border border-white/10 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Cadastrados</h2>
          {medications.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nenhum medicamento cadastrado ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-700">
              {medications.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{m.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Propósito: {m.purpose}</div>
                  </div>
                  <form action={deleteMedication}>
                    <input type="hidden" name="id" value={m.id} />
                    <SubmitButton variant="danger" label="Excluir" />
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
