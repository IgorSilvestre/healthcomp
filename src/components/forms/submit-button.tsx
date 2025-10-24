"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  label,
  disabled,
  variant = "primary",
}: {
  label: string;
  disabled?: boolean;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  const base =
    "mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "danger"
      ? "bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:opacity-90"
      : "bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 hover:opacity-90";
  return (
    <button type="submit" disabled={isDisabled} className={`${base} ${styles}`}>
      {pending ? "Salvando…" : label}
    </button>
  );
}
