import { MedicationForm } from "@/components/forms/medication-form";

export default function MedicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/85 bg-white/85 p-6 shadow-lg shadow-slate-100/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <h1 className="mb-4 text-xl font-semibold">Adicionar Medicação</h1>
          <MedicationForm />
        </section>
      </main>
    </div>
  );
}
