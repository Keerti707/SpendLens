import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";

type ReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type StoredReport = {
  auditId: string;
  generatedAt: string;
  monthlySavings: number;
};

const reportsFilePath = path.join(
  process.cwd(),
  "data",
  "reports.json"
);

export default async function ReportPage({
  params,
}: ReportPageProps) {
  const { id } = await params;

  const reportsRaw = await fs.readFile(
    reportsFilePath,
    "utf-8"
  );

  const reports: StoredReport[] = JSON.parse(reportsRaw);

  const report = reports.find(
    (item) => item.auditId === id
  );

  const annualSavings = report
    ? report.monthlySavings * 12
    : 0;

  const savingsLabel =
    report && report.monthlySavings >= 500
      ? "High-impact optimization"
      : report && report.monthlySavings > 0
        ? "Savings opportunity found"
        : "Efficient stack";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_42%)]" />
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back to SpendLens
          </Link>

          <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
            Public audit report
          </p>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
          <div className="border-b border-white/10 p-8 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-300">
              Shared SpendLens Report
            </p>

            <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_0.6fr] md:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
                  AI Spend Audit Report
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
                  A public snapshot of estimated savings discovered by
                  SpendLens across the submitted AI tooling stack.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Report Status
                </p>

                <p className="mt-3 text-lg font-semibold text-emerald-300">
                  {report ? "Available" : "Not Found"}
                </p>

                <p className="mt-2 text-sm text-white/45">
                  {report
                    ? "This report is shareable and safe to view publicly."
                    : "No stored report matches this audit ID."}
                </p>
              </div>
            </div>
          </div>

          {!report ? (
            <div className="p-8 md:p-10">
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
                <p className="text-lg font-semibold text-red-300">
                  Demo report unavailable
                </p>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  This prototype currently uses lightweight demo persistence in production deployment mode.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 p-8 md:p-10">
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
                  <p className="text-xs uppercase tracking-wide text-emerald-300/70">
                    Monthly Savings
                  </p>

                  <p className="mt-4 text-5xl font-bold text-emerald-300">
                    ${report.monthlySavings}
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    Estimated recurring monthly reduction.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Annualized Savings
                  </p>

                  <p className="mt-4 text-4xl font-bold text-white">
                    ${annualSavings}
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    Projected impact over twelve months.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                  <p className="text-xs uppercase tracking-wide text-white/40">
                    Recommendation Level
                  </p>

                  <p className="mt-4 text-2xl font-semibold text-white">
                    {savingsLabel}
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    Based on estimated optimization potential.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                  <p className="text-sm font-medium text-white">
                    Audit Metadata
                  </p>

                  <div className="mt-5 space-y-4 text-sm">
                    <div>
                      <p className="text-white/40">Audit ID</p>
                      <p className="mt-1 break-all font-mono text-white/75">
                        {report.auditId}
                      </p>
                    </div>

                    <div>
                      <p className="text-white/40">Generated</p>
                      <p className="mt-1 text-white/75">
                        {new Date(report.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                  <p className="text-sm font-medium text-white">
                    Executive Summary
                  </p>

                  <p className="mt-4 text-sm leading-7 text-white/60">
                    SpendLens found an estimated{" "}
                    <span className="font-semibold text-emerald-300">
                      ${report.monthlySavings}/month
                    </span>{" "}
                    in AI spend optimization potential. For teams with high
                    savings, this may indicate oversized plans, duplicate
                    tooling, unused seats, or an opportunity to source AI
                    infrastructure credits more efficiently.
                  </p>

                  <Link
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Run another audit
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}