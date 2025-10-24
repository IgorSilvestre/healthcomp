import Link from "next/link";
import {
  getSchedules,
  type Schedule,
  getNextDoseTimestamp,
} from "@/lib/care-log";
import { formatDateTime } from "@/lib/datetime";
import NotificationsScheduler from "@/components/notifications-scheduler";

function formatRelativeTime(
  milliseconds: number,
  formatter: Intl.RelativeTimeFormat,
) {
  const divisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60_000, "second"],
    [3_600_000, "minute"],
    [86_400_000, "hour"],
    [604_800_000, "day"],
  ];

  const absMs = Math.abs(milliseconds);
  for (const [limit, unit] of divisions) {
    if (absMs < limit) {
      const value =
        unit === "second"
          ? Math.round(milliseconds / 1_000)
          : Math.round(
              milliseconds /
                (unit === "minute"
                  ? 60_000
                  : unit === "hour"
                    ? 3_600_000
                    : 86_400_000),
            );
      return formatter.format(value, unit);
    }
  }

  const value = Math.round(milliseconds / 604_800_000);
  return formatter.format(value, "week");
}

import DeleteScheduleForm from "@/components/forms/delete-schedule-form";

function ScheduleItem({
  schedule,
  now,
  locale,
  rtf,
}: {
  schedule: Schedule;
  now: number;
  locale: string | string[];
  rtf: Intl.RelativeTimeFormat;
}) {
  const next = getNextDoseTimestamp(schedule);
  const nextLabel = isNaN(next)
    ? "Nenhuma dose futura (finalizado)"
    : `${formatDateTime(next, locale)} (${formatRelativeTime(next - now, rtf)})`;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white to-white p-5 shadow-sm transition duration-200 hover:shadow-lg dark:border-emerald-700/40 dark:from-emerald-900/40 dark:via-slate-900 dark:to-slate-950">
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
              Agendado
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
            {schedule.medicationName}
          </h3>
          {schedule.dosage && (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Dose: {schedule.dosage}
            </p>
          )}
          {schedule.notes && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {schedule.notes}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-xs text-slate-500 dark:text-slate-400 sm:items-end">
          <div className="font-medium text-slate-700 dark:text-slate-200">
            Próxima dose
          </div>
          <div>{nextLabel}</div>
          <div className="mt-2 flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <Link
              href={`/schedule/${schedule.id}/edit`}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
            >
              Editar
            </Link>
            <DeleteScheduleForm scheduleId={schedule.id} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function SchedulePage() {
  const schedules = await getSchedules();
  const now = Date.now();
  const locale = "pt-BR";
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Agendamentos
          </h1>
          <Link
            href="/schedule/new"
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Novo Agendamento
          </Link>
        </div>

        {/* Agendador de notificações (mobile e desktop) */}
        <NotificationsScheduler schedules={schedules} />

        {schedules.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
            Nenhum agendamento ainda. Clique em "Novo agendamento" para
            adicionar.
          </p>
        ) : (
          <div className="space-y-4">
            {schedules.map((s) => (
              <ScheduleItem
                key={s.id}
                schedule={s}
                now={now}
                locale={locale}
                rtf={rtf}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
