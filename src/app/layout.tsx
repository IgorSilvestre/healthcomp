import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRegister from "./sw-register";
import BottomNav from "@/components/navigation/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saúde Célio",
  description: "Acompanhamento de cuidado do nosso velinho",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
    shortcut: ["/favicon.ico"],
  },
  applicationName: "Saúde Célio",
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="sticky top-0 z-10 hidden border-b border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 sm:block">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-y-2 px-2 py-2 sm:flex-nowrap sm:px-6 sm:py-4 lg:px-8">
            <Link href="/" className="text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white sm:text-sm">
              Home
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
              <Link href="/medication" className="rounded-full bg-sky-600 px-2 py-1 font-medium text-white hover:bg-sky-700 sm:px-3 sm:py-1.5">
                Medicação
              </Link>
              <Link href="/comment" className="rounded-full bg-slate-900 px-2 py-1 font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 sm:px-3 sm:py-1.5">
                Comentário
              </Link>
              <Link href="/schedule" className="rounded-full bg-emerald-600 px-2 py-1 font-medium text-white hover:bg-emerald-700 sm:px-3 sm:py-1.5">
                Agendamento
              </Link>
              <Link href="/medication-list" className="rounded-full bg-violet-600 px-2 py-1 font-medium text-white hover:bg-violet-700 sm:px-3 sm:py-1.5">
                Medicamentos
              </Link>
              <Link href="/restrictions" className="rounded-full bg-rose-600 px-2 py-1 font-medium text-white hover:bg-rose-700 sm:px-3 sm:py-1.5">
                Restrições
              </Link>
            </div>
          </div>
        </nav>
        <main className="pb-16 sm:pb-0">{children}</main>
        <BottomNav />
        <SWRegister />
      </body>
    </html>
  );
}
