# Devlog

## Day 1 — 2026-05-11

**Hours worked:** 4

**What I did:** I read the assignment carefully and scoped SpendLens as an AI spend audit tool for startup teams. I set up the Next.js, TypeScript, Tailwind CSS, and shadcn/ui project. I built the first version of the landing page, including the hero section and the initial audit form UI.

**What I learned:** This assignment is more product-oriented than a normal coding task. The goal is not only to build screens, but to make the product feel useful, credible, and launchable.

**Blockers / what I'm stuck on:** I was still deciding how much logic should live in the frontend versus backend. I also needed to avoid overbuilding before the core audit flow worked.

**Plan for tomorrow:** Build the first audit engine, connect the form to real recommendations, and start shaping the results page.

## Day 2 — 2026-05-12

**Hours worked:** 6

**What I did:** I converted the form from a single-tool input into a multi-tool AI stack audit. I added valid plan filtering for each tool, localStorage persistence, form validation, and the first rule-based audit engine. I also added savings calculation, tool-level recommendations, priority labels, and overlap detection for Cursor plus GitHub Copilot.

**What I learned:** A useful audit product needs to be honest when savings are low. It is better to show “no obvious overspend” than to manufacture fake savings. I also learned more about controlled components and state persistence in React.

**Blockers / what I'm stuck on:** I hit hydration issues caused by localStorage and client-only UI behavior in Next.js. I fixed this by separating browser-dependent behavior carefully and testing the page after navigation.

**Plan for tomorrow:** Improve the report UI, add lead capture, create shareable report pages, and start backend persistence.

## Day 3 — 2026-05-13

**Hours worked:** 6

**What I did:** I added the audit report component, charts using Recharts, lead capture dialog, API route for lead submission, JSON persistence for leads and reports, and dynamic `/report/[id]` pages. I also improved the shared report page UI so it feels more like an executive dashboard.

**What I learned:** Separating components made the code much easier to manage. I also understood the importance of a complete SaaS funnel: audit result first, then lead capture, then shareable report.

**Blockers / what I'm stuck on:** I initially tried PDF export, but `html2canvas` struggled with newer Tailwind color formats. Since PDF export was only a bonus, I removed it to keep the app stable.

**Plan for tomorrow:** Add tests, CI, deployment, and start documenting the architecture and product decisions.

## Day 4 — 2026-05-14

**Hours worked:** 5

**What I did:** I added Vitest and wrote five automated tests for the audit engine. The tests cover inflated spend detection, coding assistant overlap, API spend credit opportunity, efficient low-cost stack behavior, and high-priority classification. I also added a GitHub Actions workflow for lint, test, and build checks.

**What I learned:** Testing the audit engine separately from the UI was easier because the logic lives in `lib/audit-engine.ts`. This confirmed that separating business logic from components was the right decision.

**Blockers / what I'm stuck on:** I had to fix TypeScript errors that only appeared during production build, especially around inferred types and priority labels.

**Plan for tomorrow:** Add AI summary fallback, transactional email support, abuse protection, and prepare the app for final deployment.

## Day 5 — 2026-05-15

**Hours worked:** 5

**What I did:** I added the AI summary API route with OpenAI support and a rule-based fallback. I added Resend email support with fallback behavior and a honeypot field for basic abuse protection. I deployed the project to Vercel and verified that the production build works.

**What I learned:** Optional integrations should fail gracefully. The app should still work if an API key is missing, especially during review. I also learned why environment variables should be used instead of hardcoded secrets.

**Blockers / what I'm stuck on:** I needed to keep the deployed version stable even without external API keys configured. I solved this by making AI and email integrations optional with fallback paths.

**Plan for tomorrow:** Write the required documentation files and make sure the repo structure matches the assignment exactly.

## Day 6 — 2026-05-16

**Hours worked:** 5

**What I did:** I wrote the main documentation files including README, ARCHITECTURE, TESTS, PROMPTS, PRICING_DATA, GTM, ECONOMICS, METRICS, and LANDING_COPY. I focused on explaining product decisions, trade-offs, testing strategy, pricing assumptions, and go-to-market thinking.

**What I learned:** Documentation is part of the product. Good docs help reviewers understand why decisions were made and what I would improve next.

**Blockers / what I'm stuck on:** Pricing data for enterprise and API tools is not always fixed publicly. I documented those cases clearly instead of pretending exact numbers were available.

**Plan for tomorrow:** Finish reflection, user interviews, final polish, GitHub upload, and final submission checks.

## Day 7 — 2026-05-17

**Hours worked:** 4

**What I did:** I completed the remaining documentation, reviewed the required file list, checked lint/test/build, verified the deployed URL, and prepared the project for GitHub submission. I also did a final product pass on the main flow: landing page, audit generation, lead capture, and shared report page.

**What I learned:** A take-home assignment like this is closer to shipping a small product than solving a coding problem. The biggest challenge was balancing scope, reliability, and polish.

**Blockers / what I'm stuck on:** With more time, I would move JSON persistence to Supabase and add stronger analytics instrumentation.

**Plan for tomorrow:** Submit the final GitHub repo and deployed URL through the Credex form.