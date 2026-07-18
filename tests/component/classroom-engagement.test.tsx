import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";

describe("Classroom and engagement stages", () => {
  it("shows the generated curriculum and engagement system", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("consulting-client-accelerator", "Women over 40")} />);
    await user.click(screen.getByRole("button", { name: /04\s*classroom/i }));
    expect(screen.getByText("Choose a Profitable Niche")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /05\s*engagement/i }));
    expect(screen.getByText("Monday commitments")).toBeVisible();
    expect(screen.getByText(/seven-day momentum sprint/i)).toBeVisible();
  });
});
