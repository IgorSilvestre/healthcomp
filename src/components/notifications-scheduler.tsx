"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type Schedule = {
  id: string;
  medicationName: string;
  dosage?: string;
  frequencyMs: number;
  startAt: number;
  endAt?: number;
  lastTakenAt?: number;
  notes?: string;
};

function computeNextDueAt(s: Schedule, now: number) {
  const base = (s.lastTakenAt ?? s.startAt) || now;
  const freq = Math.max(1, s.frequencyMs || 0);
  let next = base + freq;
  // Se já passou, avança para o próximo futuro sem loops intensos
  if (next < now) {
    const steps = Math.floor((now - base) / freq) + 1;
    next = base + steps * freq;
  }
  if (s.endAt !== undefined) {
    if (next > s.endAt) return NaN;
    if (now > s.endAt && next <= s.endAt) return NaN;
  }
  return next;
}

type PendingTimer = { id: number; scheduleId: string };

export default function NotificationsScheduler({
  schedules,
}: {
  schedules: Schedule[];
}) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default",
  );
  const [swReady, setSwReady] = useState<ServiceWorkerRegistration | null>(
    null,
  );
  const timers = useRef<PendingTimer[]>([]);
  const timerId = useRef<number | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  // Ordena próximos eventos para debug/garantia
  const upcoming = useMemo(() => {
    const now = Date.now();
    return schedules
      .map((s) => ({ s, next: computeNextDueAt(s, now) }))
      .filter((x) => !isNaN(x.next))
      .sort((a, b) => a.next - b.next);
  }, [schedules]);

  useEffect(() => {
    let cancelled = false;

    async function setupSW() {
      if (typeof window === "undefined") return null;
      if (!("serviceWorker" in navigator)) return null;
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
        if (!cancelled) setSwReady(reg);
        return reg;
      } catch {
        return null;
      }
    }

    setupSW();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPermission(
      "Notification" in window ? Notification.permission : "denied",
    );
    setShowPrompt(
      "Notification" in window && Notification.permission !== "granted",
    );
  }, []);

  function clearAllTimers() {
    for (const t of timers.current) {
      window.clearTimeout(t.id);
    }
    timers.current = [];
  }

  function scheduleNext(s: Schedule, fromTime: number) {
    const now = Date.now();
    const next = computeNextDueAt({ ...s, lastTakenAt: fromTime }, now);
    if (isNaN(next)) return;

    const delay = Math.max(0, next - now);
    const id = window.setTimeout(() => {
      // Dispara notificação
      triggerNotification(s);
      // Após disparar, agenda a próxima ocorrência
      scheduleNext(s, next);
    }, delay);

    timers.current.push({ id, scheduleId: s.id });
  }

  async function triggerNotification(s: Schedule) {
    const title = `Hora do medicamento: ${s.medicationName}`;
    const bodyParts = [] as string[];
    if (s.dosage) bodyParts.push(`Dose: ${s.dosage}`);
    if (s.notes) bodyParts.push(s.notes);
    const body = bodyParts.join("\n");

    // Prioriza Service Worker para melhor suporte entre plataformas
    if (swReady && (await navigator.serviceWorker.ready)) {
      swReady.active?.postMessage({
        type: "notify",
        payload: {
          title,
          options: {
            body,
            icon: "/favicon/android-chrome-192x192.png",
            badge: "/favicon/favicon-32x32.png",
            tag: `schedule-${s.id}`,
            renotify: true,
            data: { scheduleId: s.id },
          } as NotificationOptions,
        },
      });
      return;
    }

    // Fallback para a própria página
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        // eslint-disable-next-line no-new
        new Notification(title, { body });
      }
    } catch {
      // ignora
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    // Reagendar todos ao alterar lista
    clearAllTimers();
    const now = Date.now();
    for (const s of schedules) {
      const next = computeNextDueAt(s, now);
      if (!isNaN(next)) {
        const delay = Math.max(0, next - now);
        const id = window.setTimeout(() => {
          triggerNotification(s);
          scheduleNext(s, next);
        }, delay);
        timers.current.push({ id, scheduleId: s.id });
      }
    }

    // Limpeza ao desmontar/alterar
    return () => {
      clearAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(upcoming), permission, swReady?.active?.state]);

  async function requestPermission() {
    if (!("Notification" in window)) {
      alert("Seu navegador não suporta notificações.");
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
      setShowPrompt(p !== "granted");
    } catch {
      // ignore
    }
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-4 w-full max-w-md animate-in slide-in-from-bottom-2 fade-in rounded-2xl border border-emerald-200/60 bg-white p-4 shadow-lg dark:border-emerald-800/40 dark:bg-slate-900 sm:max-w-lg">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500"
          aria-hidden
        />
        <div className="flex-1">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Ative notificações
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Para receber alertas na hora dos agendamentos no celular e no
            desktop, permita notificações do app.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPrompt(false)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Depois
          </button>
          <button
            type="button"
            onClick={requestPermission}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Permitir
          </button>
        </div>
      </div>
    </div>
  );
}
