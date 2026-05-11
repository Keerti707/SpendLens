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

export function AuditForm() {
    const [form, setForm] = useState({
        tool: "",
        plan: "",
        monthlySpend: "",
        teamSize: "",
        useCase: "",
    });

    const [auditResult, setAuditResult] =
        useState<AuditResult | null>(null);
    const [error, setError] = useState("");

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
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
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

        setError("");

        const result = generateAudit(form);

        setAuditResult(result);
    }

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
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-white/80">Current Plan</Label>
                    <Select
                        value={form.plan}
                        onValueChange={(value) => updateForm("plan", value)}
                    >
                        <SelectTrigger className="h-12 w-full border-white/10 bg-black/40 text-white">
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-zinc-950 text-white">
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
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
                        onChange={(event) =>
                            updateForm("monthlySpend", event.target.value)
                        }
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
                        onChange={(event) =>
                            updateForm("teamSize", event.target.value)
                        }
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
                className="mt-8 w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90">
                Generate Audit
            </button>

            {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                </div>
            )}


            {auditResult && (
                <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                    <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">
                        Potential Savings
                    </p>

                    <h3 className="mt-2 text-4xl font-bold text-white">
                        ${auditResult.monthlySavings}/mo
                    </h3>

                    <p className="mt-1 text-white/60">
                        ${auditResult.annualSavings}/year estimated savings
                    </p>

                    <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                        <p className="text-sm leading-7 text-white/75">
                            {auditResult.recommendation}
                        </p>
                    </div>
                </div>
            )}

        </Card>
    );
}