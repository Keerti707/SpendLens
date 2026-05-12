# SpendLens

SpendLens is a free AI spend audit tool for startup founders, engineering managers, and small teams who want to understand whether they are overspending on AI tools. It audits tools like ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, Anthropic API, and Windsurf, then generates savings estimates, recommendations, and a shareable public report.

Live app: https://spendlens-seven-lovat.vercel.app

## What it does

SpendLens helps teams:

- enter multiple AI tools, plans, monthly spend, and seat counts
- compare current spend against expected plan costs
- detect oversized plans and inflated spend
- identify overlapping coding assistant tools
- estimate monthly and annual savings
- generate a public shareable audit report
- capture qualified leads after showing audit value

## Screenshots / Demo

Screenshots or a short screen recording will be added before final submission.

Recommended screenshots:
1. Landing page + audit form
2. Generated audit report with chart
3. Shared public report page

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Vitest
- Vercel
- OpenAI API support with fallback
- Resend email support with fallback

## Key Features

### Multi-tool AI spend audit

Users can add multiple AI tools and enter the plan, monthly spend, and number of seats for each tool.

### Rule-based audit engine

The audit engine checks:

- expected plan cost vs entered spend
- small-team enterprise overkill
- Cursor + GitHub Copilot overlap
- high API spend credit opportunities
- savings priority level

### AI summary with fallback

SpendLens can generate an AI-written executive summary when an OpenAI API key is available. If no API key is configured or the request fails, it falls back to a rule-based summary so the product remains stable.

### Lead capture

After the user sees value, SpendLens asks for email, company, and role to send the full report. This keeps the lead gate after the audit result instead of blocking value upfront.

### Shareable reports

Each captured audit gets a public report URL at:

```text
/report/<audit-id>

The public report avoids showing private lead details.

Abuse protection

The lead form includes a honeypot field to reject basic bot submissions.

Quick Start

Install dependencies:

npm install

Run the development server:

npm run dev

Open:

http://localhost:3000

Run lint:

npm run lint

Run tests:

npm test

Run production build:

npm run build
Environment Variables

The app works without these variables by falling back safely, but these can be configured for production behavior:

OPENAI_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
OPENAI_API_KEY

Used to generate the personalized audit summary. If missing, SpendLens uses a fallback rule-based summary.

RESEND_API_KEY

Used to send transactional audit confirmation emails. If missing, the app still captures leads and reports successfully.

NEXT_PUBLIC_APP_URL

Used in transactional email links.

Example:

NEXT_PUBLIC_APP_URL=https://spendlens-seven-lovat.vercel.app
Project Structure
app/
  api/
    leads/
      route.ts
    summary/
      route.ts
  report/
    [id]/
      page.tsx
  page.tsx

components/
  ui/
    audit-form.tsx
    audit-form-client.tsx
    audit-report.tsx
    lead-capture-dialog.tsx
    spend-chart.tsx

lib/
  audit-engine.ts

tests/
  audit-engine.test.ts

data/
  leads.json
  reports.json
Decisions
1. Rule-based audit math instead of AI-based math

The savings calculations are deterministic and rule-based. This makes the output easier to test, debug, and explain. AI is used only for the executive summary layer, not the financial calculation layer.

2. Lead capture after value

The form shows audit results before asking for email. This matches the product goal of building trust before conversion.

3. Multi-tool input instead of single-tool calculator

Startups rarely use only one AI tool, so SpendLens supports an AI stack rather than a single subscription.

4. Public report pages

Shareable reports make the product more viral and useful for founders or engineering managers who want to share findings internally.

5. JSON persistence for prototype speed

For this take-home build, lightweight JSON persistence keeps the project easy to run and review. In a production version, this should move to Supabase, Postgres, or another durable database.

Testing

The audit engine has automated tests covering:

inflated spend detection
coding assistant overlap
API spend credit opportunity
efficient low-cost stack
high-priority savings classification

Run:

npm test
Deployment

The app is deployed on Vercel:

https://spendlens-seven-lovat.vercel.app
Notes

SpendLens is built as a product MVP, not just a coding exercise. The focus is on a complete user flow: audit input, savings logic, results visualization, lead capture, and shareable report output.