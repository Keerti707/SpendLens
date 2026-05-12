import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fallbackSummary =
      body.fallbackSummary ||
      "SpendLens analyzed your AI stack using rule-based pricing and usage-fit checks. The audit highlights possible savings based on plan selection, team size, overlapping tools, and API spend patterns.";

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summary: fallbackSummary,
        source: "fallback",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are generating a concise executive summary for an AI spend audit.

Write around 100 words.
Be specific, practical, and finance-aware.
Do not exaggerate.
Do not invent exact facts beyond the provided audit data.

Audit data:
Total monthly spend: $${body.totalMonthlySpend}
Estimated monthly savings: $${body.totalMonthlySavings}
Estimated annual savings: $${body.totalAnnualSavings}
Number of tools audited: ${body.toolCount}

Tool recommendations:
${JSON.stringify(body.toolResults, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    return NextResponse.json({
      summary:
        completion.choices[0]?.message?.content?.trim() ||
        fallbackSummary,
      source: "ai",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        summary:
          "SpendLens completed the audit, but the AI-written summary could not be generated. The rule-based recommendations and savings estimates are still available.",
        source: "fallback",
      },
      {
        status: 200,
      }
    );
  }
}