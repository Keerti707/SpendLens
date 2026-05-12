"use client";

import { useState } from "react";
import type { AuditResult } from "@/lib/audit-engine";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type LeadCaptureDialogProps = {
    auditResult: AuditResult;
};

export function LeadCaptureDialog({
    auditResult,
}: LeadCaptureDialogProps) {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");

    async function handleSubmit() {
        try {
            const response = await fetch("/api/leads", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    company,
                    role,

                    auditId: auditResult.auditId,

                    monthlySavings:
                        auditResult.totalMonthlySavings,

                    generatedAt:
                        auditResult.generatedAt,
                }),
            });

            const data = await response.json();

            console.log(data);

            alert("Report request submitted successfully!");
        } catch (error) {
            console.error(error);

            alert("Something went wrong.");
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="mt-6 w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90">
                    Get Full Audit Report
                </button>
            </DialogTrigger>

            <DialogContent className="border-white/10 bg-zinc-950 text-white">
                <DialogHeader>
                    <DialogTitle>Send me the full report</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Enter your details to receive the full SpendLens audit summary.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            placeholder="you@company.com"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                            placeholder="Acme AI"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                            placeholder="Founder / Engineering Manager"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
                    >
                        Send Report
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}