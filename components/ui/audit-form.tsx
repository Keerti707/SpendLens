"use client";

import { useEffect, useState } from "react";
import {
  generateAudit,
  type AuditResult,
  type AuditToolEntry,
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

function createEmptyTool(): AuditToolEntry {
  return {
    id: crypto.randomUUID(),
    tool: "",
    plan: "",
    monthlySpend: "",
    seats: "",
  };
}

export function AuditForm() {
  const [form, setForm] = useState(() => {
  if (typeof window === "undefined") {
    return {
      tools: [createEmptyTool()],
      teamSize: "",
      useCase: "",
    };
  }

  const savedForm = localStorage.getItem("spendlens-audit-form");

  return savedForm
    ? JSON.parse(savedForm)
    : {
        tools: [createEmptyTool()],
        teamSize: "",
        useCase: "",
      };
});

  const [auditResult, setAuditResult] =
    useState<AuditResult | null>(null);

  const [error, setError] = useState("");
  const [auditRunCount, setAuditRunCount] = useState(0);

  useEffect(() => {
    localStorage.setItem(
      "spendlens-audit-form",
      JSON.stringify(form)
    );
  }, [form]);

  function updateRootField(
    field: "teamSize" | "useCase",
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setAuditResult(null);
    setError("");
  }

  function updateTool(
    toolId: string,
    field: keyof AuditToolEntry,
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      tools: currentForm.tools.map((tool) => {
        if (tool.id !== toolId) {
          return tool;
        }

        if (field === "tool") {
          return {
            ...tool,
            tool: value,
            plan: "",
          };
        }

        return {
          ...tool,
          [field]: value,
        };
      }),
    }));

    setAuditResult(null);
    setError("");
  }

  function addTool() {
    setForm((currentForm) => ({
      ...currentForm,
      tools: [...currentForm.tools, createEmptyTool()],
    }));

    setAuditResult(null);
    setError("");
  }

  function removeTool(toolId: string) {
    setForm((currentForm) => ({
      ...currentForm,
      tools:
        currentForm.tools.length === 1
          ? currentForm.tools
          : currentForm.tools.filter(
              (tool) => tool.id !== toolId
            ),
    }));

    setAuditResult(null);
    setError("");
  }

  function handleGenerateAudit() {
    const hasEmptyTool = form.tools.some(
      (tool) =>
        !tool.tool ||
        !tool.plan ||
        !tool.monthlySpend ||
        !tool.seats
    );

    if (
      hasEmptyTool ||
      !form.teamSize ||
      !form.useCase
    ) {
      setError(
        "Please complete every tool row before generating an audit."
      );

      setAuditResult(null);
      return;
    }

    const hasInvalidPlan = form.tools.some((tool) => {
      const validPlans =
        toolPlans[
          tool.tool as keyof typeof toolPlans
        ];

      return !validPlans.includes(tool.plan);
    });

    if (hasInvalidPlan) {
      setError(
        "One selected plan does not exist for its AI tool."
      );

      setAuditResult(null);
      return;
    }

    setError("");

    const result = generateAudit(form);

    setAuditResult(result);

    setAuditRunCount((count) => count + 1);
  }

  return (
    <Card className="mt-20 w-full max-w-5xl border border-white/10 bg-white/[0.04] p-8 text-left shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Run your AI spend audit
          </h2>

          <p className="mt-2 text-sm text-white/55">
            Add every AI tool your team pays for.
            SpendLens checks plan fit, overlap,
            and savings opportunities.
          </p>
        </div>

        <button
          onClick={addTool}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          + Add Tool
        </button>
      </div>

      <div className="space-y-5">
        {form.tools.map((toolEntry, index) => {
          const availablePlans = toolEntry.tool
            ? toolPlans[
                toolEntry.tool as keyof typeof toolPlans
              ]
            : [];

          return (
            <div
              key={toolEntry.id}
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white/70">
                  Tool #{index + 1}
                </p>

                <button
                  onClick={() =>
                    removeTool(toolEntry.id)
                  }
                  className="text-sm text-white/40 transition hover:text-red-300"
                  disabled={form.tools.length === 1}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-white/80">
                    AI Tool
                  </Label>

                  <Select
                    value={toolEntry.tool}
                    onValueChange={(value) =>
                      updateTool(
                        toolEntry.id,
                        "tool",
                        value
                      )
                    }
                  >
                    <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
                      <SelectValue placeholder="Tool" />
                    </SelectTrigger>

                    <SelectContent className="border-white/10 bg-zinc-950 text-white">
                      {Object.entries(toolLabels).map(
                        ([value, label]) => (
                          <SelectItem
                            key={value}
                            value={value}
                          >
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">
                    Plan
                  </Label>

                  <Select
                    value={toolEntry.plan}
                    onValueChange={(value) =>
                      updateTool(
                        toolEntry.id,
                        "plan",
                        value
                      )
                    }
                    disabled={!toolEntry.tool}
                  >
                    <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>

                    <SelectContent className="border-white/10 bg-zinc-950 text-white">
                      {availablePlans.map((plan) => (
                        <SelectItem
                          key={plan}
                          value={plan}
                        >
                          {planLabels[plan]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">
                    Spend ($/mo)
                  </Label>

                  <Input
                    className="h-12 border-white/10 bg-black/40 text-white placeholder:text-white/30"
                    min={0}
                    placeholder="200"
                    type="number"
                    value={toolEntry.monthlySpend}
                    onChange={(event) =>
                      updateTool(
                        toolEntry.id,
                        "monthlySpend",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">
                    Seats
                  </Label>

                  <Input
                    className="h-12 border-white/10 bg-black/40 text-white placeholder:text-white/30"
                    min={1}
                    placeholder="5"
                    type="number"
                    value={toolEntry.seats}
                    onChange={(event) =>
                      updateTool(
                        toolEntry.id,
                        "seats",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t border-white/10 pt-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">
            Team Context
          </h3>

          <p className="mt-1 text-sm text-white/50">
            These settings apply across your
            entire AI stack audit.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white/80">
              Total Team Size
            </Label>

            <Input
              className="h-12 border-white/10 bg-black/40 text-white placeholder:text-white/30"
              min={1}
              placeholder="8"
              type="number"
              value={form.teamSize}
              onChange={(event) =>
                updateRootField(
                  "teamSize",
                  event.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">
              Primary Use Case
            </Label>

            <Select
              value={form.useCase}
              onValueChange={(value) =>
                updateRootField(
                  "useCase",
                  value
                )
              }
            >
              <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
                <SelectValue placeholder="Select use case" />
              </SelectTrigger>

              <SelectContent className="border-white/10 bg-zinc-950 text-white">
                <SelectItem value="coding">
                  Coding
                </SelectItem>

                <SelectItem value="writing">
                  Writing
                </SelectItem>

                <SelectItem value="data">
                  Data
                </SelectItem>

                <SelectItem value="research">
                  Research
                </SelectItem>

                <SelectItem value="mixed">
                  Mixed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerateAudit}
        className="mt-8 w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
      >
        Generate Full Stack Audit
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
            $
            {auditResult.totalAnnualSavings}
            /year estimated savings from $
            {
              auditResult.totalMonthlySpend
            }
            /mo current spend
          </p>

          {auditResult.totalMonthlySavings ===
            0 && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Good news — this audit still
              shows no obvious overspend
              based on the current inputs.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {auditResult.toolResults.map(
              (result) => (
                <div
                  key={result.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="font-medium text-white">
                      {
                        toolLabels[
                          result.tool
                        ]
                      }{" "}
                      —{" "}
                      {
                        planLabels[
                          result.plan
                        ]
                      }
                    </p>

                    <p className="text-sm text-emerald-300">
                      Save $
                      {
                        result.monthlySavings
                      }
                      /mo
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {
                      result.recommendation
                    }
                  </p>
                </div>
              )
            )}
          </div>

          <p className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-7 text-white/75 backdrop-blur">
            {auditResult.summary}
          </p>
        </div>
      )}
    </Card>
  );
}