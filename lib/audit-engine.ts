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
  recommendation: string;
};

export type AuditResult = {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolResults: ToolAuditResult[];
  summary: string;
};

export function generateAudit(form: AuditFormData): AuditResult {
  const teamSize = Number(form.teamSize);

  const toolResults = form.tools.map((entry) => {
    const currentSpend = Number(entry.monthlySpend);
    const seats = Number(entry.seats);

    let monthlySavings = 0;
    let recommendation =
      "This tool appears reasonably matched to the current team size and use case.";

    if (entry.tool === "chatgpt" && entry.plan === "team" && seats <= 3) {
      monthlySavings = Math.min(currentSpend, seats * 10);
      recommendation =
        "ChatGPT Team may be more than this small team needs. Individual Plus seats could cover the workflow at lower cost.";
    }

    if (entry.tool === "cursor" && entry.plan === "enterprise" && teamSize <= 5) {
      monthlySavings = Math.round(currentSpend * 0.35);
      recommendation =
        "Cursor Enterprise may be excessive for a smaller engineering team. Cursor Pro or Business is likely a better fit before enterprise controls are needed.";
    }

    if (entry.tool === "copilot" && form.useCase === "coding" && currentSpend >= 100) {
      monthlySavings = Math.round(currentSpend * 0.2);
      recommendation =
        "GitHub Copilot spend is meaningful for this team. Consolidating overlapping coding assistants may reduce duplicated spend.";
    }

    if (
      (entry.tool === "openai" || entry.tool === "anthropic") &&
      currentSpend >= 500
    ) {
      monthlySavings = Math.round(currentSpend * 0.2);
      recommendation =
        "API spend is high enough that discounted infrastructure credits could materially reduce monthly costs.";
    }

    return {
      id: entry.id,
      tool: entry.tool,
      plan: entry.plan,
      currentSpend,
      monthlySavings,
      annualSavings: monthlySavings * 12,
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
      totalMonthlySavings > 0
        ? "SpendLens found practical savings by checking plan fit, team size, and possible spend consolidation."
        : "SpendLens did not find obvious overspend from the current inputs. This stack appears reasonably efficient.",
  };
}