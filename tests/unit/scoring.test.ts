import { describe, expect, it } from "vitest";
import { calculateLaunchScore, scoreBand } from "@/domain/scoring";

describe("Community Launch Score", () => {
  it("applies the specified weights and rounds only the final total", () => {
    const result = calculateLaunchScore({
      problemUrgency: 80,
      transformationClarity: 90,
      audienceSpecificity: 70,
      willingnessToPay: 75,
      founderCredibility: 80,
      curriculumStrength: 85,
      engagementRetention: 75,
      acquisitionFeasibility: 60,
      operationalSafety: 100,
    });
    expect(result.total).toBe(79);
    expect(result.band).toBe("strong");
  });

  it("uses the approved score boundaries", () => {
    expect(scoreBand(85)).toBe("ready");
    expect(scoreBand(70)).toBe("strong");
    expect(scoreBand(50)).toBe("promising");
    expect(scoreBand(49)).toBe("validate");
  });
});
