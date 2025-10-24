"use client";

import { useFormState } from "react-dom";
import { deleteScheduleAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { TrashButton } from "@/components/button/trashButton";

export default function DeleteScheduleForm({ scheduleId }: { scheduleId: string }) {
  const [, formAction] = useFormState(deleteScheduleAction, defaultActionState);

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
      <TrashButton
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/50"
      />
    </form>
  );
}
