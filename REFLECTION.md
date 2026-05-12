# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I hit was a hydration issue in Next.js. The audit form used localStorage and Radix/shadcn select components, and the page sometimes rendered differently on the server and client. This caused hydration mismatch errors and, at one point, the form showed a loading state after navigating back from a report page.

My first hypothesis was that the issue came only from localStorage. I tried delaying localStorage reads and rendering a loading placeholder until the browser mounted. That fixed the hydration error but introduced another user experience issue where the form could stay stuck in loading after browser navigation.

I then tested navigation more carefully: landing page → report page → browser back. That helped me see that the fix needed to preserve client behavior without blocking the UI. I separated browser-dependent behavior more carefully, removed the unnecessary permanent loading gate, and verified the flow manually. I also kept running lint and production build after changes because some issues only appeared outside the dev happy path.

The main lesson was that Next.js server/client boundaries matter a lot. Browser APIs, client components, and server-rendered pages need to be handled deliberately.

## 2. A decision I reversed mid-week, and what made me reverse it

One decision I reversed was adding PDF export. Initially, I thought PDF export would be a strong bonus because the assignment mentioned it as an optional feature and it made sense for an audit report product.

I implemented a first version using `jspdf` and `html2canvas`, but it created runtime issues because `html2canvas` struggled with newer CSS color formats used by Tailwind/shadcn. The export button also distracted from more important requirements like shareable report URLs, lead capture, AI summary fallback, tests, and documentation.

I reversed the decision because the feature was optional, unstable, and not worth risking the core product experience. I removed the PDF implementation and focused on the required MVP: working audit flow, shareable reports, lead capture, backend persistence, testing, and deployment.

This was a useful product decision. A broken bonus feature is worse than no bonus feature. I learned to protect the core user flow first and only add extras when they do not reduce reliability.

## 3. What I would build in week 2 if I had it

In week 2, I would move the persistence layer from JSON files to Supabase or Postgres. The JSON approach is simple and inspectable for this prototype, but it is not durable enough for production serverless deployment.

I would also store the full audit payload, not only report metadata. This would make shared reports richer and allow users to revisit the exact recommendations they received.

The next major product improvement would be benchmark mode. For example, SpendLens could show:

> Your AI spend per developer is $X. Teams your size typically spend around $Y.

This would make the audit more valuable because users do not only want a savings number; they want context.

I would also add analytics instrumentation for audit started, audit completed, lead captured, high-savings lead generated, and report shared. That would help understand whether SpendLens is actually producing qualified Credex leads.

Finally, I would add an admin dashboard for Credex to view high-savings leads, sort by monthly savings, and prioritize outreach.

## 4. How I used AI tools

I used AI tools as a pair-programming and product-planning assistant. AI helped me break the assignment into smaller steps, think through product scope, draft documentation structure, and debug implementation issues faster.

I did not treat AI output as final. I ran the app locally, tested flows manually, ran lint, wrote automated tests, fixed production build errors, and adjusted product decisions based on what actually worked.

One specific place where AI was wrong was the PDF export direction. The generated implementation seemed reasonable, but once tested, it caused runtime issues with CSS parsing. I caught this during manual testing and removed the feature because it was optional and unstable.

I also caught UI and product issues during testing, such as the lead form submitting empty values, the sample report button not working, and browser back navigation causing a loading problem. Those were not things I wanted to hide or ignore; I fixed them because they affected reviewer and user experience.

AI was useful for acceleration, but I stayed responsible for the final behavior and trade-offs.

## 5. Self-rating

### Discipline: 8/10

I worked across multiple stages of the product instead of only building the UI: setup, audit logic, backend routes, tests, deployment, and documentation.

### Code quality: 8/10

The code is separated into audit engine, UI components, API routes, and tests. I also fixed TypeScript production build errors instead of ignoring them.

### Design sense: 8/10

The UI has a polished SaaS-style direction with dark gradients, cards, charts, priority labels, and a cleaner shared report page. With more time, I would refine mobile spacing further.

### Problem-solving: 8.5/10

I debugged hydration issues, localStorage behavior, production build failures, broken navigation, and unstable PDF export. I made trade-offs instead of forcing broken features.

### Entrepreneurial thinking: 8.5/10

The project includes a full lead-generation flow, shareable reports, GTM thinking, economics modeling, and honest savings behavior. It is designed as something Credex could plausibly use as a top-of-funnel product.