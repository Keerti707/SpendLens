# SpendLens Architecture

## Overview

SpendLens is a Next.js + TypeScript web app that audits AI tool spend for startup teams. The product flow is intentionally simple: a user enters their AI stack, receives an instant audit, submits lead details after seeing value, and gets redirected to a public shareable report.

The system is split into four main layers:

1. Frontend UI
2. Rule-based audit engine
3. API routes for lead/report capture
4. Lightweight persistence for prototype review

## System Diagram

```mermaid
flowchart TD
    A[Visitor lands on SpendLens] --> B[Audit Form]
    B --> C[Local Form State + localStorage]
    B --> D[Rule-based Audit Engine]
    D --> E[Audit Result Dashboard]
    E --> F[AI Summary API]
    F --> E
    E --> G[Lead Capture Dialog]
    G --> H[POST /api/leads]
    H --> I[data/leads.json]
    H --> J[data/reports.json]
    H --> K[Optional Resend Email]
    H --> L[Redirect to /report/:auditId]
    L --> M[Public Report Page]
Data Flow
The user opens the landing page and fills the audit form.
Form state is stored in React state and persisted to localStorage so refreshes do not wipe progress.
When the user clicks Generate Full Stack Audit, the form data is passed to generateAudit() in lib/audit-engine.ts.
The audit engine calculates expected spend, possible savings, annual savings, priority labels, and tool-level recommendations.
The result is rendered in AuditReport, including metrics, recommendations, charts, and a summary.
The summary API can generate an AI-written executive summary if OPENAI_API_KEY exists. Otherwise, it returns the deterministic fallback.
After the report is shown, the lead dialog captures email, company, role, and a hidden honeypot field.
/api/leads validates the honeypot, stores lead/report metadata, optionally sends an email through Resend, and returns success.
The user is redirected to /report/:auditId.
The shared report page reads report metadata and displays a public-safe report without exposing email/company details.
Key Files
lib/audit-engine.ts

Contains the deterministic audit logic. This file is intentionally framework-independent so it can be tested easily.

components/ui/audit-form.tsx

Manages the multi-tool form, local persistence, validation, and audit generation.

components/ui/audit-report.tsx

Displays audit results, savings cards, chart, priority labels, and summary.

components/ui/lead-capture-dialog.tsx

Captures lead details after the audit result is visible.

app/api/leads/route.ts

Handles lead capture, honeypot protection, report persistence, and optional transactional email.

app/api/summary/route.ts

Handles optional AI-generated summary with fallback behavior.

app/report/[id]/page.tsx

Displays the public shareable audit report.

Why Next.js

I chose Next.js because it supports both product UI and backend routes in one codebase. For this assignment, that made it possible to ship a realistic full-stack MVP quickly without maintaining a separate backend service.

Next.js also provides:

App Router for clean page structure
API routes for lead and summary endpoints
Vercel deployment compatibility
server-rendered public report pages
TypeScript support for safer iteration
Why TypeScript

TypeScript was used because the audit engine has structured objects for tools, plans, recommendations, and priorities. Types made it easier to catch mistakes during production build, especially around audit result fields and priority values.

Why Rule-Based Audit Logic

The audit math is rule-based instead of AI-generated because financial recommendations need to be deterministic and defensible. The LLM is used only for summarizing results, while the actual savings calculation stays testable and explainable.

This also matches the product expectation that the reasoning should be finance-aware rather than vague or hallucinated.

Current Persistence Choice

For the prototype, leads and report metadata are stored in JSON files under data/.

This keeps the app easy to inspect and run during review. In production, this should move to Supabase, Postgres, Firebase, or Cloudflare D1 because serverless file writes are not durable long-term.

What I Would Change for 10k Audits/Day

If SpendLens needed to handle 10k audits per day, I would change the architecture in these ways:

Replace JSON files with Supabase or Postgres.
Store full audit payloads, not only report metadata.
Add rate limiting by IP/email.
Move email sending to a background job or queue.
Cache public report pages.
Add structured logging and monitoring.
Add analytics events for audit started, audit completed, lead captured, and report shared.
Add a pricing-data version field so audits can be tied to the pricing table used at generation time.
Add stronger validation using Zod on API routes.
Add admin reporting for Credex to view high-savings leads.
Security and Privacy Notes

The public report page shows only audit ID, generated time, and savings metadata. It does not expose private lead information like email, company, or role.

The lead form includes a hidden honeypot field to block simple bot submissions.

Secrets such as OPENAI_API_KEY and RESEND_API_KEY are read from environment variables and are not committed to the repository.