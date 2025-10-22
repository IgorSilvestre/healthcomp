import { CommentForm } from "@/components/forms/comment-form";
import { LogDoseForm } from "@/components/forms/log-dose-form";
import { MedicationForm } from "@/components/forms/medication-form";
import { ScheduleForm } from "@/components/forms/schedule-form";
import {
  getHistory,
  getNextDoseTimestamp,
  getSchedules,
  type HistoryEntry,
} from "@/lib/care-log";

const NEAR_WINDOW_MS = 45 * 60 * 1000;

function formatDateTime(value: number, locale: string | string[] = "default") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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

function formatFrequency(ms: number) {
  const hours = ms / 3_600_000;
  if (hours >= 1) {
    const rounded = Number.isInteger(hours)
      ? hours
      : Math.round(hours * 10) / 10;
    return `${rounded} hour${rounded === 1 ? "" : "s"}`;
  }
  const minutes = ms / 60_000;
  const rounded = Number.isInteger(minutes)
    ? minutes
    : Math.round(minutes * 10) / 10;
  return `${rounded} minute${rounded === 1 ? "" : "s"}`;
}

function HistoryCard({
  entry,
  now,
  locale,
  formatter,
}: {
  entry: HistoryEntry;
  now: number;
  locale: string | string[];
  formatter: Intl.RelativeTimeFormat;
}) {
  const timestamp = formatDateTime(entry.createdAt, locale);
  const relative = formatRelativeTime(entry.createdAt - now, formatter);

  if (entry.type === "medication") {
    return (
      <article
        key={entry.id}
        className="group relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-50/80 via-white to-white p-5 shadow-sm transition duration-200 hover:shadow-lg dark:border-sky-700/40 dark:from-sky-900/40 dark:via-slate-900 dark:to-slate-950"
      >
        <div className="absolute -left-1 top-12 h-24 w-24 rounded-full bg-sky-200/40 blur-3xl transition group-hover:bg-sky-200/60 dark:bg-sky-400/10" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                Medication
              </span>
              {entry.scheduleId && (
                <span className="text-xs font-medium text-sky-500 dark:text-sky-300">
                  From schedule
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
              {entry.medicationName}
            </h3>
            {entry.dosage && (
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Dose: {entry.dosage}
              </p>
            )}
            {entry.note && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {entry.note}
              </p>
            )}
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <time className="block font-medium text-slate-600 dark:text-slate-200">
              {timestamp}
            </time>
            <span>{relative}</span>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 dark:bg-white/5">
            <span aria-hidden>💊</span>
            {entry.author ? `Logged by ${entry.author}` : "Logged dose"}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      key={entry.id}
      className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-sm transition duration-200 hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-900/70"
    >
      <div className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-slate-200/50 blur-3xl dark:bg-slate-600/20" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-white/5 dark:text-slate-300">
            Comment
          </span>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
            {entry.message}
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
          <time className="block font-medium text-slate-600 dark:text-slate-200">
            {timestamp}
          </time>
          <span>{relative}</span>
        </div>
      </div>
      {entry.author && (
        <div className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-300">
          <span aria-hidden>📝</span>
          <span>{entry.author}</span>
        </div>
      )}
    </article>
  );
}

export default async function Home() {
  const [history, schedules] = await Promise.all([
    getHistory(),
    getSchedules(),
  ]);
  const now = Date.now();
  const locale = "default";
  const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  const schedulesWithState = schedules
    .map((schedule) => {
      const nextDueAt = getNextDoseTimestamp(schedule);
      const msUntilDue = nextDueAt - now;
      const isWithinWindow = Math.abs(msUntilDue) <= NEAR_WINDOW_MS;
      const isOverdue = msUntilDue < 0;
      return {
        ...schedule,
        nextDueAt,
        msUntilDue,
        isWithinWindow,
        isOverdue,
      };
    })
    .sort((a, b) => a.nextDueAt - b.nextDueAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-16 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-lg shadow-sky-100/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
                Prontuário digital
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                O velinho agradece
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                Keep every caretaker aligned with a live medication stream,
                always-on schedule reminders, and shift-to-shift updates.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl border border-sky-200/60 bg-sky-50/60 p-5 text-sm text-slate-700 shadow-sm dark:border-sky-700/60 dark:bg-sky-900/40 dark:text-slate-100">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Snapshot
              </span>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {history.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    History entries
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {schedules.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active schedules
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="flex flex-col gap-8">
            <section className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-sky-100/40 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Medication schedule
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Always know when the next dose is coming up.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-300">
                  Window alert when within 45 minutes
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {schedulesWithState.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                    No schedules yet. Add one to keep everyone on track.
                  </p>
                ) : (
                  schedulesWithState.map((item) => {
                    const nextDueReadable = formatDateTime(
                      item.nextDueAt,
                      locale,
                    );
                    const relative = formatRelativeTime(
                      item.msUntilDue,
                      relativeFormatter,
                    );
                    const statusMessage = item.isOverdue
                      ? `Overdue — missed ${relative}.`
                      : item.isWithinWindow
                        ? `Due ${relative}.`
                        : `Next dose ${relative}.`;
                    const statusTone = item.isOverdue
                      ? "text-rose-600 bg-rose-100/60 dark:bg-rose-500/20 dark:text-rose-200"
                      : item.isWithinWindow
                        ? "text-amber-600 bg-amber-100/60 dark:bg-amber-500/20 dark:text-amber-200"
                        : "text-slate-600 bg-slate-100/70 dark:bg-slate-700/30 dark:text-slate-200";

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-900/70"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {item.medicationName}
                            </h3>
                            {item.dosage && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {item.dosage}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusTone}`}
                          >
                            {statusMessage}
                          </span>
                        </div>
                        <dl className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                              Next dose
                            </dt>
                            <dd className="font-medium text-slate-700 dark:text-slate-200">
                              {nextDueReadable}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                              Frequency
                            </dt>
                            <dd>Every {formatFrequency(item.frequencyMs)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-slate-500 dark:text-slate-400">
                              Last logged
                            </dt>
                            <dd>
                              {item.lastTakenAt
                                ? formatDateTime(item.lastTakenAt, locale)
                                : "Not yet logged"}
                            </dd>
                          </div>
                        </dl>
                        {item.notes && (
                          <p className="mt-3 rounded-xl bg-slate-900/5 p-3 text-xs italic text-slate-600 dark:bg-white/5 dark:text-slate-300">
                            {item.notes}
                          </p>
                        )}
                        <LogDoseForm
                          scheduleId={item.id}
                          disabled={!item.isWithinWindow}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/40 bg-white/85 p-6 shadow-lg shadow-slate-100/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Shift history
                </h2>
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Newest first
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {history.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                    No history yet. Log a medication or comment to get started.
                  </p>
                ) : (
                  history.map((entry) => (
                    <HistoryCard
                      key={entry.id}
                      entry={entry}
                      now={now}
                      locale={locale}
                      formatter={relativeFormatter}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            <MedicationForm />
            <CommentForm />
            <ScheduleForm />
          </aside>
        </section>
      </main>
    </div>
  );
}
