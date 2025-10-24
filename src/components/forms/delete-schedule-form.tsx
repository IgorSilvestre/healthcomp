"use client";

import { useFormState } from "react-dom";
import { deleteScheduleAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";

export default function DeleteScheduleForm({ scheduleId }: { scheduleId: string }) {
  const [state, formAction] = useFormState(deleteScheduleAction, defaultActionState);

  return (
    <form
      action={async (formData: FormData) => {
        if (typeof window !== "undefined") {
          const ok = window.confirm("Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.");
          if (!ok) return;
        }
        return formAction(formData);
      }}
      className="inline"
    >
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <button
        type="submit"
        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200"
        aria-label="Excluir agendamento"
      >
        {state.status === "idle" ? "Excluir" : state.status === "success" ? "Excluído" : "Tente de novo"}
      </button>
    </form>
  );
}
