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

        const existingLeadsRaw = await fs.readFile(
            leadsFilePath,
            "utf-8"
        );

        const existingLeads = JSON.parse(existingLeadsRaw);

        const newLead = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...body,
        };

        const existingReportsRaw = await fs.readFile(
            reportsFilePath,
            "utf-8"
        );

        const existingReports = JSON.parse(
            existingReportsRaw
        );

        const newReport = {
            auditId: body.auditId,
            generatedAt: body.generatedAt,
            monthlySavings: body.monthlySavings,
        };

        existingReports.push(newReport);

        await fs.writeFile(
            reportsFilePath,
            JSON.stringify(existingReports, null, 2)
        );

        existingLeads.push(newLead);

        await fs.writeFile(
            leadsFilePath,
            JSON.stringify(existingLeads, null, 2)
        );

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