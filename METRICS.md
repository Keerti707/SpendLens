# Metrics

## North Star Metric

The North Star metric for SpendLens is:

```text
Qualified AI savings reports generated

A qualified savings report means a user completed an audit, received a savings estimate, and generated or requested a report.

I chose this instead of daily active users because SpendLens is not a daily-use product. A founder or engineering manager may only audit AI spend monthly or quarterly. The important signal is whether the tool helps the right user reach a meaningful savings insight.

Why This Metric Fits

SpendLens is a B2B lead-generation and diagnostic tool. The product succeeds when it identifies real savings opportunities and turns them into qualified Credex leads.

A generic metric like page views would not prove much. A better signal is:

Did a user with actual AI spend complete the audit and request the report?

That action shows both intent and perceived value.

Input Metrics
1. Audit completion rate

This measures how many visitors finish the audit after starting it.

If completion is low, the form may be too long, confusing, or not trustworthy enough.

2. Lead capture rate after audit

This measures how many users submit email/company/role after seeing their savings.

This is important because the product intentionally captures email after value is shown.

3. High-savings lead rate

This measures how many completed audits show more than $500/month in estimated savings.

These leads are most commercially relevant for Credex because they are more likely to benefit from discounted AI credits.

What I Would Instrument First

I would track these events first:

landing page viewed
audit started
tool row added
audit completed
total monthly spend entered
estimated monthly savings
lead captured
public report opened
high-savings report generated

Each event should include non-sensitive metadata such as savings range, number of tools, and use case. I would avoid storing private details in analytics events.

Pivot Threshold

If fewer than 20% of users who start an audit complete it, I would simplify the form.

If fewer than 15% of completed audits become lead captures, I would improve the report value, CTA copy, or trust signals.

If fewer than 5% of completed audits show meaningful savings, the product may need a narrower target audience such as AI-heavy startups, devtool companies, or teams with high API usage.

Week-1 Target

A successful first week would look like:

100 visitors
40 audits completed
15 leads captured
5 high-savings reports
3 consultation-ready leads

The most important signal is not traffic volume. It is whether users with real AI spend find the report useful enough to share their email.
```