import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";

describe("Studio foundation", () => {
  it("applies an AI recommendation and updates the live preview", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("consulting-client-accelerator", "Women over 40")} />);

    await user.click(screen.getByRole("button", { name: /apply suggestion/i }));
    const preview = screen.getByLabelText("Community preview");
    expect(preview).toHaveTextContent("first five clients");
    expect(preview).toHaveTextContent("The Second Act Consulting Lab");
  });
});
