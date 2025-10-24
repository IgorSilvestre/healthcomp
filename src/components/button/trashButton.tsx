import React from "react";

type Props = {
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function TrashButton({ type = "submit", className = "" }: Props) {
  return (
    <button
      type={type}
      aria-label="Excluir"
      title="Excluir"
      className={`${className} cursor-pointer`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6m4-6v6"
        />
      </svg>
    </button>
  );
}
