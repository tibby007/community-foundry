import { describe, expect, it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { GenerationResponseSchema } from "@/lib/ai/contracts";
import { fallbackProvider } from "@/lib/ai/provider";

describe("AI generation provider", () => {
  it("returns a valid deterministic foundation proposal", async () => {
    const response = await fallbackProvider.generate({
      project: createProjectFromTemplate("consulting-client-accelerator", "Women over 40"),
      section: "foundation",
      instruction: "Strengthen the promise",
    });

    expect(GenerationResponseSchema.safeParse(response).success).toBe(true);
    expect(response.proposal.section).toBe("foundation");
    expect(response.meta.provider).toBe("fallback");
  });
});
