import { describe, expect, it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { applyManualChange, applyProposal, undoLastChange } from "@/domain/proposals";

describe("proposal engine", () => {
  it("preserves user-locked fields while applying allowed changes", () => {
    const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
    project.lockedPaths = ["foundation.promise"];
    const originalPromise = project.foundation.promise;

    const result = applyProposal(project, {
      id: "p1",
      section: "foundation",
      changes: {
        "foundation.promise": "AI replacement",
        "foundation.name": "The Second Act Consulting Lab",
      },
    });

    expect(result.project.foundation.promise).toBe(originalPromise);
    expect(result.project.foundation.name).toBe("The Second Act Consulting Lab");
    expect(result.skippedPaths).toEqual(["foundation.promise"]);
  });

  it("undoes the latest accepted proposal", () => {
    const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
    const updated = applyProposal(project, {
      id: "p2",
      section: "foundation",
      changes: { "foundation.name": "The Second Act Consulting Lab" },
    }).project;

    expect(undoLastChange(updated).foundation.name).toBe(project.foundation.name);
  });

  it("records a manual edit as one undoable change", () => {
    const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
    const firstEdit = structuredClone(project);
    firstEdit.foundation.name = "Beautiful";
    const afterFirstKeypress = applyManualChange(project, firstEdit, "foundation.name");
    const finishedEdit = structuredClone(afterFirstKeypress);
    finishedEdit.foundation.name = "Beautiful Gardens Creator Lab";
    const updated = applyManualChange(afterFirstKeypress, finishedEdit, "foundation.name");

    expect(updated.history).toHaveLength(1);
    expect(undoLastChange(updated).foundation.name).toBe(project.foundation.name);
  });

  it("rejects a change outside the proposal section", () => {
    const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
    expect(() => applyProposal(project, {
      id: "p3",
      section: "foundation",
      changes: { "offer.foundingOffer": "Sneaky overwrite" },
    })).toThrow(/not allowed/i);
  });
});
