"use client";

import dynamic from "next/dynamic";

export const AuditFormClient = dynamic(
  () =>
    import("@/components/ui/audit-form").then(
      (mod) => mod.AuditForm
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mt-20 w-full max-w-5xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-white/50">
        Loading audit form...
      </div>
    ),
  }
);