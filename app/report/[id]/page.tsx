import { promises as fs } from "fs";
import path from "path";

type ReportPageProps = {
    params: Promise<{
        id: string;
    }>;
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

    const reports = JSON.parse(reportsRaw);

    const report = reports.find(
        (item: { auditId: string }) =>
            item.auditId === id
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-6 py-16 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_40%)]" />

            <div className="relative mx-auto max-w-4xl">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-wide text-indigo-300">
                        Shared SpendLens Report
                    </p>

                    <h1 className="mt-4 text-4xl font-bold">
                        Audit Report
                    </h1>

                    {!report ? (
                        <p className="mt-6 text-red-400">
                            Report not found.
                        </p>
                    ) : (
                        <div className="mt-6 space-y-4">
                            <p className="text-white/70">
                                Audit ID:
                                <span className="ml-2 font-mono text-white">
                                    {report.auditId}
                                </span>
                            </p>

                            <p className="text-white/70">
                                Estimated Monthly Savings:
                                <span className="ml-2 text-emerald-300">
                                    ${report.monthlySavings}/mo
                                </span>
                            </p>

                            <p className="text-white/50">
                                Generated at{" "}
                                {new Date(
                                    report.generatedAt
                                ).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}