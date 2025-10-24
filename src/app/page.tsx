import { type HistoryEntry, getHistory } from "@/lib/care-log";

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
                Medicação
              </span>
              {entry.scheduleId && (
                <span className="text-xs font-medium text-sky-500 dark:text-sky-300">
                  de agendamento
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
            Comentário
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
  const history = await getHistory();
  const now = Date.now();
  const locale = "default";
  const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/85 bg-white/85 p-6 shadow-lg shadow-slate-100/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Histórico</h2>
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mais recente primeiro</span>
          </div>
          <div className="mt-6 space-y-4">
            {history.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                Sem histórico ainda, adicione na navigação acima
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
      </main>
    </div>
  );
}
