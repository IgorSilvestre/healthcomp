import CatalogMedicationForm from "@/components/forms/catalog-medication-form";

export default async function NewCatalogMedicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <CatalogMedicationForm />
      </main>
    </div>
  );
}
