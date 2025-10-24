"use client";

import { useActionState } from "react";
import { deleteRestriction as deleteRestrictionAction } from "@/app/actions";
import { defaultActionState } from "@/lib/action-state";
import { TrashButton } from "@/components/button/trashButton";

export function DeleteRestrictionForm({ restrictionId }: { restrictionId: string }) {
  const [, formAction] = useActionState(deleteRestrictionAction, defaultActionState);

  return (
    <form
      action={async (formData: FormData) => {
        if (typeof window !== "undefined") {
          const ok = window.confirm("Tem certeza que deseja excluir esta restrição? Esta ação não pode ser desfeita.");
          if (!ok) return;
        }
        return formAction(formData);
      }}
      className="ml-3"
    >
      <input type="hidden" name="id" value={restrictionId} />
      <TrashButton
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:hover:bg-red-950"
      />
    </form>
  );
}
