import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";
import { buildFallbackLessonContent } from "@/lib/ai/lesson-content";

describe("Classroom and engagement stages", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  it("shows the generated curriculum and engagement system", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("consulting-client-accelerator", "Women over 40")} />);
    await user.click(screen.getByRole("button", { name: /04\s*classroom/i }));
    expect(screen.getByDisplayValue("Choose a Profitable Niche")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /05\s*engagement/i }));
    expect(screen.getByDisplayValue(/Monday commitments/)).toBeVisible();
    expect(screen.getByDisplayValue(/seven-day momentum sprint/i)).toBeVisible();
  });

  it("builds a complete lesson and exposes image and video production", async () => {
    const content = buildFallbackLessonContent({ communityName: "AI Agent Builder Lab", audience: "women over 50", transformation: "Build an AI agent", moduleTitle: "AI Agent Fundamentals", lessonTitle: "Understand AI Agent Fundamentals" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ content, provider: "fallback" }) }));
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("ai-business-builder", "Women over 50")} />);

    await user.click(screen.getByRole("button", { name: /04\s*classroom/i }));
    await user.click(screen.getAllByRole("button", { name: /expand lesson/i })[0]);
    await user.click(screen.getByRole("button", { name: /build complete lesson/i }));

    expect(await screen.findByLabelText("Lesson manuscript")).toHaveValue(content.manuscript);
    expect(screen.getByRole("button", { name: /generate lesson image/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /create 8-second video clip/i })).toBeVisible();
  });
});
