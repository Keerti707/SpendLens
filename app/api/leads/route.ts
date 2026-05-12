import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

const reportsFilePath = path.join(
  process.cwd(),
  "data",
  "reports.json"
);

const leadsFilePath = path.join(
  process.cwd(),
  "data",
  "leads.json"
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json(
        {
          success: false,
          message: "Spam detected",
        },
        {
          status: 400,
        }
      );
    }

    const newLead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...body,
    };

    const newReport = {
      auditId: body.auditId,
      generatedAt: body.generatedAt,
      monthlySavings: body.monthlySavings,
    };

    try {
      const existingLeadsRaw = await fs.readFile(
        leadsFilePath,
        "utf-8"
      );

      const existingLeads = JSON.parse(existingLeadsRaw);

      existingLeads.push(newLead);

      await fs.writeFile(
        leadsFilePath,
        JSON.stringify(existingLeads, null, 2)
      );
    } catch (error) {
      console.error("Lead persistence skipped:", error);
    }

    try {
      const existingReportsRaw = await fs.readFile(
        reportsFilePath,
        "utf-8"
      );

      const existingReports = JSON.parse(existingReportsRaw);

      existingReports.push(newReport);

      await fs.writeFile(
        reportsFilePath,
        JSON.stringify(existingReports, null, 2)
      );
    } catch (error) {
      console.error("Report persistence skipped:", error);
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "SpendLens <onboarding@resend.dev>",
        to: body.email,
        subject: "Your SpendLens AI spend audit is ready",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Your SpendLens audit is ready</h2>
            <p>Thanks for using SpendLens. Your audit found an estimated <strong>$${body.monthlySavings}/month</strong> in potential AI spend savings.</p>
            <p>You can view your public report here:</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/report/${body.auditId}">
                Open audit report
              </a>
            </p>
            ${
              body.monthlySavings >= 500
                ? "<p>Your savings potential is high enough that a Credex consultation may help capture more of this value through discounted AI credits.</p>"
                : "<p>Your stack has been recorded for future optimization updates.</p>"
            }
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to capture lead",
      },
      {
        status: 500,
      }
    );
  }
}