# Pricing Data

## Notes

Pricing was collected from official vendor pricing pages during the submission week. SpendLens uses this pricing data to estimate whether a user’s entered monthly spend is higher than the expected cost for their selected tool, plan, and seat count.

Some enterprise and API pricing is custom or usage-based. In those cases, SpendLens treats the entered spend as the current baseline and applies optimization rules only when the spend pattern suggests a credit or plan-fit opportunity.

Verified date: 2026-05-12

---

## ChatGPT

Official pricing page: https://openai.com/chatgpt/pricing/

- Plus: $20/user/month
- Team: $30/user/month
- Enterprise: custom pricing
- API direct: usage-based

How SpendLens uses it:

- Plus is modeled at $20/user/month.
- Team is modeled at $30/user/month.
- Enterprise is estimated conservatively for plan-fit comparison because public pricing may vary.
- API direct is treated as usage-based.

---

## Claude

Official pricing page: https://www.anthropic.com/pricing

- Free: $0/user/month
- Pro: $20/user/month
- Max: varies by tier
- Team: $30/user/month
- Enterprise: custom pricing
- API direct: usage-based

How SpendLens uses it:

- Free is modeled at $0.
- Pro is modeled at $20/user/month.
- Team is modeled at $30/user/month.
- Enterprise and API direct are treated as custom or usage-based.

---

## Cursor

Official pricing page: https://cursor.com/pricing

- Hobby: $0/user/month
- Pro: $20/user/month
- Business: $40/user/month
- Enterprise: custom pricing

How SpendLens uses it:

- Hobby is modeled at $0.
- Pro is modeled at $20/user/month.
- Business is modeled at $40/user/month.
- Enterprise is treated as custom and flagged for smaller teams when it appears excessive.

---

## GitHub Copilot

Official pricing page: https://github.com/features/copilot/plans

- Individual: $10/user/month
- Business: $19/user/month
- Enterprise: $39/user/month

How SpendLens uses it:

- Individual is modeled at $10/user/month.
- Business is modeled at $19/user/month.
- Enterprise is modeled at $39/user/month.
- When Copilot overlaps with Cursor in a coding-focused stack, SpendLens flags possible duplicate assistant spend.

---

## Gemini

Official pricing page: https://gemini.google/subscriptions/

- Gemini Pro / Google AI Pro: approximately $20/user/month
- Gemini Ultra / Google AI Ultra: approximately $250/user/month
- API: usage-based

How SpendLens uses it:

- Pro is modeled at $20/user/month.
- Ultra is modeled at $250/user/month.
- API is treated as usage-based.

---

## OpenAI API

Official pricing page: https://openai.com/api/pricing/

- API pricing varies by model and token usage.

How SpendLens uses it:

- OpenAI API spend is treated as usage-based.
- When monthly API spend is high, SpendLens flags possible savings through discounted credits or infrastructure optimization.

---

## Anthropic API

Official pricing page: https://www.anthropic.com/api

- API pricing varies by model and token usage.

How SpendLens uses it:

- Anthropic API spend is treated as usage-based.
- When monthly API spend is high, SpendLens flags possible savings through discounted credits or infrastructure optimization.

---

## Windsurf

Official pricing page: https://windsurf.com/pricing

- Free: $0/user/month
- Pro: approximately $15/user/month
- Team: approximately $30/user/month

How SpendLens uses it:

- Free is modeled at $0.
- Pro is modeled at $15/user/month.
- Team is modeled at $30/user/month.

---

## Important Limitation

Pricing changes frequently, especially for AI tools. SpendLens should store a pricing-data version in production so each audit can be tied to the pricing table used at generation time.

For this submission, pricing is documented manually in this file and encoded in `lib/audit-engine.ts`.