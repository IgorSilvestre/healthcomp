import { getScheduleById } from "@/lib/care-log";
import EditScheduleForm from "@/components/forms/edit-schedule-form";
import { getMedications } from "@/lib/medications";

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const schedule = await getScheduleById(id);
  const medications = await getMedications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {!schedule ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            Agendamento não encontrado. Verifique o link e tente novamente.
          </p>
        ) : (
          <EditScheduleForm schedule={schedule} medications={medications} />
        )}
      </main>
    </div>
  );
}
