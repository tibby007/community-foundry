import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { createProjectFromScratch, createProjectFromTemplate } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";

describe("Studio foundation", () => {
  afterEach(cleanup);
  it("applies an AI recommendation and updates the live preview", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("consulting-client-accelerator", "Women over 40")} />);

    await user.click(screen.getByRole("button", { name: /apply suggestion/i }));
    const preview = screen.getByLabelText("Community preview");
    expect(preview).toHaveTextContent("first five clients");
    expect(preview).toHaveTextContent("The Second Act Consulting Lab");
  });

  it("guides a scratch builder to the next section", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromScratch("I help women over 50 build AI agents")} />);

    expect(screen.getByText(/shape how members will join and pay/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /continue to offer/i }));
    expect(screen.getByRole("heading", { name: "Offer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to community/i })).toBeInTheDocument();
  });

  it("undoes a manual edit and explains when nothing remains to undo", async () => {
    const user = userEvent.setup();
    render(<StudioShell initialProject={createProjectFromScratch("I help women over 40 create beautiful gardens")} />);
    const name = screen.getByLabelText("Community name");
    const originalName = (name as HTMLInputElement).value;

    await user.clear(name);
    await user.type(name, "Garden Makers Club");
    await user.click(screen.getByRole("button", { name: /^undo$/i }));

    expect(name).toHaveValue(originalName);
    expect(screen.getByRole("button", { name: /^undo$/i })).toBeDisabled();
    expect(screen.getByText(/nothing to undo yet/i)).toBeInTheDocument();
  });
});
