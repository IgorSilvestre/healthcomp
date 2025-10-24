import Link from "next/link";
import { CommentForm } from "@/components/forms/comment-form";

export default function CommentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <nav className="sticky top-0 z-10 border-b border-white/40 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
            Home
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/medication" className="rounded-full bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-700">
              Medication
            </Link>
            <Link href="/comment" className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">
              Comment
            </Link>
            <Link href="/schedule" className="rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700">
              Schedule
            </Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/85 bg-white/85 p-6 shadow-lg shadow-slate-100/50 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none">
          <h1 className="mb-4 text-xl font-semibold">Add Comment</h1>
          <CommentForm />
        </section>
      </main>
    </div>
  );
}
