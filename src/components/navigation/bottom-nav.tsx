"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Item = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

const items: Item[] = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5Z"
        />
        <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/medication",
    label: "Medicação",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 3.75h3A3.75 3.75 0 0 1 17.25 7.5v1.5H6.75V7.5A3.75 3.75 0 0 1 10.5 3.75Z"
        />
        <rect x="3" y="9" width="18" height="12" rx="3" ry="3" />
        <path d="M12 12v6M9 15h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/comment",
    label: "Comentário",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4.5 4v-4.5Z"
        />
      </svg>
    ),
  },
  {
    href: "/list-medication",
    label: "Medicamentos",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        {/* Cápsula horizontal */}
        <rect x="4" y="8" width="16" height="8" rx="4" />
        {/* Divisão da cápsula */}
        <path d="M12 8v8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/schedule",
    label: "Agenda",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        <rect x="7" y="13" width="4" height="3" rx="0.75" />
      </svg>
    ),
  },
  {
    href: "/restrictions",
    label: "Restrições",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-white/40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-900/70 sm:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0px)" }}
      aria-label="Navegação inferior"
    >
      <ul className="mx-auto flex max-w-6xl items-stretch justify-around px-2 py-2">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`group flex h-12 flex-col items-center justify-center gap-0.5 rounded-md px-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
                aria-label={label}
              >
                <span className={`flex items-center justify-center rounded-full p-1 ${active ? "ring-2 ring-sky-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" : ""}`}>
                  {icon(active)}
                </span>
                <span className="sr-only">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
