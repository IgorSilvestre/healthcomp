import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <nav className="sticky top-0 z-10 border-b border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white mr-4">
              Home
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/medication" className="rounded-full bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-700">
                Medicação
              </Link>
              <Link href="/comment" className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">
                Comentário
              </Link>
              <Link href="/schedule" className="rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700">
                Agendamento
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
