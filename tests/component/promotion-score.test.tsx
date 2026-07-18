import { render,screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe,expect,it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { StudioShell } from "@/components/studio/studio-shell";

describe("promotion score improvement",()=>{
  it("applies the referral campaign and improves the launch score from 74 to 86",async()=>{
    const user=userEvent.setup();
    render(<StudioShell initialProject={createProjectFromTemplate("consulting-client-accelerator","Women over 40")}/>);
    await user.click(screen.getByRole("button",{name:/07promotion/i}));
    expect(screen.getByText("74")).toBeVisible();
    await user.click(screen.getByRole("button",{name:/apply referral campaign/i}));
    expect(screen.getByText("86")).toBeVisible();
    expect(screen.getByText(/acquisition feasibility improved/i)).toBeVisible();
  });
});
