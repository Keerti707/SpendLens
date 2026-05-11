export type AuditToolEntry = {
    id: string;
    tool: string;
    plan: string;
    monthlySpend: string;
    seats: string;
};

export type AuditFormData = {
    tools: AuditToolEntry[];
    teamSize: string;
    useCase: string;
};

export type ToolAuditResult = {
    id: string;
    tool: string;
    plan: string;
    currentSpend: number;
    monthlySavings: number;
    annualSavings: number;
    priority: "high" | "medium" | "low";
    recommendation: string;
};

export type AuditResult = {
    totalMonthlySpend: number;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    toolResults: ToolAuditResult[];
    summary: string;
};

const expectedMonthlyCost: Record<string, Record<string, number>> = {
    chatgpt: {
        plus: 20,
        team: 30,
        enterprise: 60,
        "api-direct": 0,
    },
    claude: {
        free: 0,
        pro: 20,
        max: 100,
        team: 30,
        enterprise: 60,
        "api-direct": 0,
    },
    cursor: {
        hobby: 0,
        pro: 20,
        business: 40,
        enterprise: 80,
    },
    copilot: {
        individual: 10,
        business: 19,
        enterprise: 39,
    },
    gemini: {
        pro: 20,
        ultra: 250,
        api: 0,
    },
    anthropic: {
        "api-direct": 0,
    },
    openai: {
        "api-direct": 0,
    },
    windsurf: {
        free: 0,
        pro: 15,
        team: 30,
    },
};

function getReasonablePlanCost(
    tool: string,
    plan: string,
    seats: number,
    currentSpend: number
) {
    const perSeatPrice = expectedMonthlyCost[tool]?.[plan];

    if (tool === "openai" || tool === "anthropic") {
        return currentSpend;
    }

    if (perSeatPrice === undefined) {
        return currentSpend;
    }

    return perSeatPrice * seats;
}

export function generateAudit(form: AuditFormData): AuditResult {
    const teamSize = Number(form.teamSize);
    const hasCursor = form.tools.some((tool) => tool.tool === "cursor");
    const hasCopilot = form.tools.some((tool) => tool.tool === "copilot");
    const hasCodingOverlap =
        form.useCase === "coding" && hasCursor && hasCopilot;
    const toolResults = form.tools.map((entry) => {
        const currentSpend = Number(entry.monthlySpend);
        const seats = Number(entry.seats);

        const expectedSpend = getReasonablePlanCost(
            entry.tool,
            entry.plan,
            seats,
            currentSpend
        );

        let monthlySavings = Math.max(
            0,
            currentSpend - expectedSpend
        );

        let recommendation =
            "This tool appears reasonably matched to the current team size and use case.";

        if (monthlySavings > 0) {
            recommendation =
                "Your entered spend is higher than the expected cost for this tool, plan, and seat count. This suggests unused seats, billing mismatch, or an opportunity to downgrade.";
        }

        if (
            entry.tool === "chatgpt" &&
            entry.plan === "enterprise" &&
            teamSize <= 10
        ) {
            monthlySavings = Math.max(
                monthlySavings,
                Math.round(currentSpend * 0.5)
            );

            recommendation =
                "ChatGPT Enterprise may be excessive for a smaller team unless strict admin, security, or procurement controls are required. A Team or Plus setup could likely reduce spend.";
        }

        if (
            entry.tool === "chatgpt" &&
            entry.plan === "team" &&
            seats <= 3
        ) {
            monthlySavings = Math.max(
                monthlySavings,
                Math.min(currentSpend, seats * 10)
            );

            recommendation =
                "ChatGPT Team may be more than this small team needs. Individual Plus seats could cover the workflow at lower cost.";
        }

        if (
            entry.tool === "cursor" &&
            entry.plan === "enterprise" &&
            teamSize <= 5
        ) {
            monthlySavings = Math.max(
                monthlySavings,
                Math.round(currentSpend * 0.35)
            );

            recommendation =
                "Cursor Enterprise may be excessive for a smaller engineering team. Cursor Pro or Business is likely a better fit before enterprise controls are needed.";
        }

        if (
            entry.tool === "claude" &&
            entry.plan === "free" &&
            currentSpend > 0
        ) {
            monthlySavings = currentSpend;

            recommendation =
                "Claude Free should not create recurring seat spend. This likely represents billing leakage, incorrect plan tracking, or spend that should be categorized under API usage.";
        }

        if (
            (entry.tool === "openai" || entry.tool === "anthropic") &&
            currentSpend >= 500
        ) {
            monthlySavings = Math.max(
                monthlySavings,
                Math.round(currentSpend * 0.2)
            );

            recommendation =
                "API spend is high enough that discounted infrastructure credits could materially reduce monthly costs.";
        }
        if (
            hasCodingOverlap &&
            (entry.tool === "cursor" || entry.tool === "copilot")
        ) {
            monthlySavings = Math.max(
                monthlySavings,
                Math.round(currentSpend * 0.25)
            );

            recommendation =
                "This stack includes overlapping coding assistants. Keeping both Cursor and GitHub Copilot may duplicate spend unless each has a clearly separate workflow.";
        }
        return {
            id: entry.id,
            tool: entry.tool,
            plan: entry.plan,
            currentSpend,
            monthlySavings,
            annualSavings: monthlySavings * 12,

            priority:
                monthlySavings >= 500
                    ? "high"
                    : monthlySavings >= 100
                        ? "medium"
                        : "low",

            recommendation,
        };
    });

    const totalMonthlySpend = toolResults.reduce(
        (sum, result) => sum + result.currentSpend,
        0
    );

    const totalMonthlySavings = toolResults.reduce(
        (sum, result) => sum + result.monthlySavings,
        0
    );

    const totalAnnualSavings = totalMonthlySavings * 12;

    return {
        totalMonthlySpend,
        totalMonthlySavings,
        totalAnnualSavings,
        toolResults,
        summary:
            totalMonthlySavings >= 500
                ? "SpendLens identified significant optimization opportunities across your AI stack. Your current tooling mix appears to include overlapping subscriptions and enterprise-grade plans that may exceed the operational needs of the current team size."
                : totalMonthlySavings >= 100
                    ? "SpendLens detected moderate savings opportunities by analyzing plan selection, team utilization, and possible overlap between tools in your workflow."
                    : totalMonthlySavings > 0
                        ? "SpendLens found a few smaller optimization opportunities that could slightly reduce recurring AI tooling costs without impacting workflow quality."
                        : "SpendLens did not identify meaningful overspend in the current stack. Your AI tooling setup appears relatively efficient for the provided team size and use case.",
    };
}