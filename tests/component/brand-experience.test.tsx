import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createProjectFromScratch } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";

describe("brand experience", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("changes the live identity and uses community-specific fallback assets", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ url: "data:image/svg+xml,custom-garden-cover", provider: "fallback" }) }));
    const user = userEvent.setup();
    const project = createProjectFromScratch("I help women over 40 create beautiful gardens");
    render(<StudioShell initialProject={project} />);
    await user.click(screen.getByRole("button", { name: /06\s*brand/i }));

    const preview = screen.getByLabelText("Community preview");
    const cover = preview.querySelector(".preview-cover") as HTMLElement;
    const before = cover.style.backgroundImage;
    await user.click(screen.getByRole("button", { name: /bold/i }));
    expect(cover.style.backgroundImage).not.toBe(before);
    await user.click(screen.getByRole("button", { name: /warm/i }));

    expect(cover.style.backgroundImage).not.toMatch(/7357ff|7657ff/i);
    const coverImage = screen.getByAltText(`${project.foundation.name} Community cover`);
    expect(coverImage.getAttribute("src")).toMatch(/^data:image\/svg\+xml/);
    expect(coverImage.getAttribute("src")).not.toMatch(/community-cover\.svg|Second.Act/i);

    await user.click(screen.getByRole("button", { name: /generate variation for community cover/i }));
    expect(await screen.findByText(/custom fallback/i)).toBeVisible();
    expect(within(screen.getByText("Community cover").closest("article")!).getByRole("img").getAttribute("src")).toContain("custom-garden-cover");
  });
});
