import { describe, expect, it } from "vitest";
import { MARKET_SIGNALS, getSignalsForTemplate } from "@/data/market-signals";

describe("market signal provenance", () => {
  it("provides at least two cited summaries per template without raw content", () => {
    expect(new Set(MARKET_SIGNALS.map((signal) => signal.templateId)).size).toBe(10);
    for (const templateId of new Set(MARKET_SIGNALS.map((signal) => signal.templateId))) {
      expect(getSignalsForTemplate(templateId).length).toBeGreaterThanOrEqual(2);
    }
    for (const signal of MARKET_SIGNALS) {
      expect(signal.sourceUrl).toMatch(/^https:\/\//);
      expect(signal.accessedAt).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(signal.summary.length).toBeLessThanOrEqual(300);
      expect("rawContent" in signal).toBe(false);
    }
  });
});
