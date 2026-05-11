export type AuditFormData = {
  tool: string;
  plan: string;
  monthlySpend: string;
  teamSize: string;
  useCase: string;
};

export type AuditResult = {
  monthlySavings: number;
  annualSavings: number;
  recommendation: string;
};

export function generateAudit(
  form: AuditFormData
): AuditResult {
  const monthlySpend = Number(form.monthlySpend);
  const teamSize = Number(form.teamSize);

  if (
    form.tool === "chatgpt" &&
    form.plan === "team" &&
    teamSize <= 3
  ) {
    return {
      monthlySavings: 25,
      annualSavings: 300,
      recommendation:
        "Your team may not require collaboration features included in ChatGPT Team. ChatGPT Plus could likely support your workflow at a lower monthly cost.",
    };
  }

  if (
    form.tool === "cursor" &&
    form.plan === "enterprise" &&
    teamSize <= 5
  ) {
    return {
      monthlySavings: 80,
      annualSavings: 960,
      recommendation:
        "Cursor Enterprise may be excessive for a smaller engineering team. Cursor Pro could likely provide similar coding assistance at significantly lower cost.",
    };
  }

  if (monthlySpend >= 500) {
    return {
      monthlySavings: Math.round(monthlySpend * 0.2),
      annualSavings: Math.round(monthlySpend * 0.2 * 12),
      recommendation:
        "Your AI infrastructure costs are high enough that discounted infrastructure credits through providers like Credex could meaningfully reduce spend.",
    };
  }

  return {
    monthlySavings: 0,
    annualSavings: 0,
    recommendation:
      "Your current AI tooling setup already appears reasonably cost-efficient based on the information provided.",
  };
}