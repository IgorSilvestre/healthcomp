import { ScheduleForm } from "@/components/forms/schedule-form";
import { getMedications } from "@/lib/medications";

export default async function NewSchedulePage() {
  const medications = await getMedications();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Novo agendamento
          </h1>
        </div>
        <ScheduleForm medications={medications} />
      </main>
    </div>
  );
}
