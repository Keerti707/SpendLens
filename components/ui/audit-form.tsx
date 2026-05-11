"use client";

import { useEffect, useState } from "react";
import {
  generateAudit,
  type AuditResult,
} from "@/lib/audit-engine";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const toolPlans = {
  chatgpt: ["plus", "team", "enterprise", "api-direct"],
  claude: ["free", "pro", "max", "team", "enterprise", "api-direct"],
  cursor: ["hobby", "pro", "business", "enterprise"],
  copilot: ["individual", "business", "enterprise"],
  gemini: ["pro", "ultra", "api"],
  anthropic: ["api-direct"],
  openai: ["api-direct"],
  windsurf: ["free", "pro", "team"],
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

export function AuditForm() {
  const [form, setForm] = useState({
    tool: "",
    plan: "",
    monthlySpend: "",
    teamSize: "",
    useCase: "",
  });

  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [auditRunCount, setAuditRunCount] = useState(0);

  useEffect(() => {
    const savedForm = localStorage.getItem("spendlens-audit-form");

    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("spendlens-audit-form", JSON.stringify(form));
  }, [form]);

  function updateForm(field: keyof typeof form, value: string) {
    setForm((currentForm) => {
      if (field === "tool") {
        return {
          ...currentForm,
          tool: value,
          plan: "",
        };
      }

      return {
        ...currentForm,
        [field]: value,
      };
    });

    setAuditResult(null);
    setError("");
  }

  function handleGenerateAudit() {
    if (
      !form.tool ||
      !form.plan ||
      !form.monthlySpend ||
      !form.teamSize ||
      !form.useCase
    ) {
      setError("Please complete all fields before generating an audit.");
      setAuditResult(null);
      return;
    }

    const validPlans = toolPlans[form.tool as keyof typeof toolPlans];

    if (!validPlans.includes(form.plan)) {
      setError("This plan does not exist for the selected AI tool.");
      setAuditResult(null);
      return;
    }

    setError("");

    const result = generateAudit(form);

    setAuditResult(result);
    setAuditRunCount((count) => count + 1);
  }

  const availablePlans = form.tool
    ? toolPlans[form.tool as keyof typeof toolPlans]
    : [];

  return (
    <Card className="mt-20 w-full max-w-4xl border border-white/10 bg-white/[0.04] p-8 text-left shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Run your AI spend audit
        </h2>
        <p className="mt-2 text-sm text-white/55">
          Add one tool to start. We’ll compare your spend against practical plan
          and stack recommendations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-white/80">AI Tool</Label>
          <Select
            value={form.tool}
            onValueChange={(value) => updateForm("tool", value)}
          >
            <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
              <SelectValue placeholder="Select a tool" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-white">
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="cursor">Cursor</SelectItem>
              <SelectItem value="copilot">GitHub Copilot</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="anthropic">Anthropic API</SelectItem>
              <SelectItem value="openai">OpenAI API</SelectItem>
              <SelectItem value="windsurf">Windsurf</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Current Plan</Label>
          <Select
            value={form.plan}
            onValueChange={(value) => updateForm("plan", value)}
            disabled={!form.tool}
          >
            <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-white">
              {availablePlans.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {planLabels[plan]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Monthly Spend ($)</Label>
          <Input
            className="h-12 border-white/10 bg-black/40 text-white placeholder:text-white/30"
            min={0}
            placeholder="200"
            type="number"
            value={form.monthlySpend}
            onChange={(event) => updateForm("monthlySpend", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80">Team Size</Label>
          <Input
            className="h-12 border-white/10 bg-black/40 text-white placeholder:text-white/30"
            min={1}
            placeholder="5"
            type="number"
            value={form.teamSize}
            onChange={(event) => updateForm("teamSize", event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-white/80">Primary Use Case</Label>
          <Select
            value={form.useCase}
            onValueChange={(value) => updateForm("useCase", value)}
          >
            <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-white">
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={handleGenerateAudit}
        className="mt-8 w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
      >
        Generate Audit
      </button>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {auditResult && (
        <div
          key={auditRunCount}
          className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-900/5 p-6 shadow-2xl shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">
              Potential Savings
            </p>

            <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
              Audit updated #{auditRunCount}
            </p>
          </div>

          <h3 className="mt-2 bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-5xl font-bold text-transparent">
            ${auditResult.monthlySavings}/mo
          </h3>

          <p className="mt-1 text-white/60">
            ${auditResult.annualSavings}/year estimated savings
          </p>

          {auditResult.monthlySavings === 0 && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Good news — this audit still shows no obvious overspend based on
              the current inputs.
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
            <p className="text-sm leading-7 text-white/75">
              {auditResult.recommendation}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}