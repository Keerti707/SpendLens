import { AuditFormClient } from "@/components/ui/audit-form-client";
import Link from "next/link";
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_40%)]" />

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70 backdrop-blur">
          AI Spend Intelligence
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Stop Overspending on AI Tools.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/60">
          SpendLens audits your AI stack and uncovers hidden savings across
          ChatGPT, Claude, Cursor, Copilot, Gemini, and more.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90">
            Run Free Audit
          </button>

          <Link
            href="/report/demo-report"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View Sample Report
          </Link>
        </div>
        <AuditFormClient />
      </div>
    </main>
  );
}