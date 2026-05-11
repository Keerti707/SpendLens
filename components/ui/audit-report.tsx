import type { AuditResult } from "@/lib/audit-engine";
import { SpendChart } from "./spend-chart";

const toolLabels: Record<string, string> = {
    chatgpt: "ChatGPT",
    claude: "Claude",
    cursor: "Cursor",
    copilot: "GitHub Copilot",
    gemini: "Gemini",
    anthropic: "Anthropic API",
    openai: "OpenAI API",
    windsurf: "Windsurf",
};

const planLabels: Record<string, string> = {
    free: "Free",
    hobby: "Hobby",
    pro: "Pro",
    max: "Max",
    plus: "Plus",
    team: "Team",
    business: "Business",
    enterprise: "Enterprise",
    individual: "Individual",
    ultra: "Ultra",
    api: "API",
    "api-direct": "API Direct",
};

type AuditReportProps = {
    auditResult: AuditResult;
    auditRunCount: number;
};

export function AuditReport({
    auditResult,
    auditRunCount,
}: AuditReportProps) {
    const hasHighSavings = auditResult.totalMonthlySavings >= 500;
    const optimizedSpend =
        auditResult.totalMonthlySpend - auditResult.totalMonthlySavings;
    const efficiencyScore = Math.max(
        62,
        100 -
        Math.round(
            (auditResult.totalMonthlySavings /
                Math.max(auditResult.totalMonthlySpend, 1)) *
            100
        )
    );

    return (
        <div
            key={auditRunCount}
            className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-900/5 p-6 shadow-2xl shadow-emerald-500/10"
        >
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">
                    Full Stack Savings
                </p>

                <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
                    Audit updated #{auditRunCount}
                </p>
            </div>

            <h3 className="mt-2 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-5xl font-bold text-transparent">
                ${auditResult.totalMonthlySavings}/mo
            </h3>

            <p className="mt-1 text-white/60">
                ${auditResult.totalAnnualSavings}/year estimated savings from $
                {auditResult.totalMonthlySpend}/mo current spend
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                        AI Efficiency Score
                    </p>

                    <p className="mt-3 text-3xl font-bold text-white">
                        {efficiencyScore}%
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                        Based on stack efficiency and spend fit.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                        Monthly AI Spend
                    </p>

                    <p className="mt-3 text-3xl font-bold text-white">
                        ${auditResult.totalMonthlySpend}
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                        Current combined stack cost.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <p className="text-xs uppercase tracking-wide text-white/40">
                        Estimated Savings
                    </p>

                    <p className="mt-3 text-3xl font-bold text-emerald-300">
                        ${auditResult.totalMonthlySavings}
                    </p>

                    <p className="mt-2 text-sm text-white/50">
                        Potential optimized monthly reduction.
                    </p>
                </div>
            </div>

            <SpendChart
                currentSpend={auditResult.totalMonthlySpend}
                optimizedSpend={optimizedSpend}
            />

            {hasHighSavings && (
                <div className="mt-5 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-5">
                    <p className="text-sm font-medium text-indigo-200">
                        Credex opportunity detected
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                        Your audit shows enough monthly savings potential that discounted AI
                        credits could materially reduce your spend.
                    </p>
                </div>
            )}

            {auditResult.totalMonthlySavings === 0 && (
                <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    Good news — this audit still shows no obvious overspend based on the
                    current inputs.
                </p>
            )}

            <div className="mt-6 space-y-4">
                {auditResult.toolResults.map((result) => (
                    <div
                        key={result.id}
                        className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur"
                    >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <p className="font-medium text-white">
                                {toolLabels[result.tool]} — {planLabels[result.plan]}
                            </p>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${result.priority === "high"
                                            ? "bg-red-500/20 text-red-300"
                                            : result.priority === "medium"
                                                ? "bg-yellow-500/20 text-yellow-300"
                                                : "bg-emerald-500/20 text-emerald-300"
                                        }`}
                                >
                                    {result.priority.toUpperCase()} PRIORITY
                                </span>

                                <p className="text-sm text-emerald-300">
                                    Save ${result.monthlySavings}/mo
                                </p>
                            </div>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-white/70">
                            {result.recommendation}
                        </p>
                    </div>
                ))}
            </div>

            <p className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/75 backdrop-blur">
                {auditResult.summary}
            </p>
        </div>
    );
}