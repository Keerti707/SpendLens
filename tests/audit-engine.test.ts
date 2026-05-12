import { describe, expect, it } from "vitest";
import { generateAudit } from "../lib/audit-engine";

describe("generateAudit", () => {
  it("detects inflated spend above expected plan cost", () => {
    const result = generateAudit({
      teamSize: "3",
      useCase: "writing",
      tools: [
        {
          id: "tool-1",
          tool: "chatgpt",
          plan: "team",
          monthlySpend: "300",
          seats: "3",
        },
      ],
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("detects coding assistant overlap", () => {
    const result = generateAudit({
      teamSize: "5",
      useCase: "coding",
      tools: [
        {
          id: "tool-1",
          tool: "cursor",
          plan: "pro",
          monthlySpend: "120",
          seats: "5",
        },
        {
          id: "tool-2",
          tool: "copilot",
          plan: "business",
          monthlySpend: "150",
          seats: "5",
        },
      ],
    });

    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("flags high API spend as a credit opportunity", () => {
    const result = generateAudit({
      teamSize: "8",
      useCase: "data",
      tools: [
        {
          id: "tool-1",
          tool: "openai",
          plan: "api-direct",
          monthlySpend: "700",
          seats: "8",
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(140);
  });

  it("returns zero savings for an efficient low-cost stack", () => {
    const result = generateAudit({
      teamSize: "1",
      useCase: "research",
      tools: [
        {
          id: "tool-1",
          tool: "gemini",
          plan: "pro",
          monthlySpend: "20",
          seats: "1",
        },
      ],
    });

    expect(result.totalMonthlySavings).toBe(0);
  });

  it("assigns high priority to large savings opportunities", () => {
    const result = generateAudit({
      teamSize: "4",
      useCase: "mixed",
      tools: [
        {
          id: "tool-1",
          tool: "chatgpt",
          plan: "enterprise",
          monthlySpend: "2000",
          seats: "4",
        },
      ],
    });

    expect(result.toolResults[0].priority).toBe("high");
  });
});