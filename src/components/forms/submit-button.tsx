"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {pending ? "Salvando…" : label}
    </button>
  );
}
