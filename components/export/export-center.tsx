"use client";

import { BookOpenCheck, Download, FileJson, FileSpreadsheet, FileText, ImageIcon } from "lucide-react";
import type { CommunityProject } from "@/domain/project-schema";
import { campaignToMarkdown, classroomToCsv, communityToCsv, skoolSetupGuide, toJson, toMarkdown } from "@/domain/exports";

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportCenter({ project }: { project: CommunityProject }) {
  const name = slug(project.foundation.name);
  const files = [
    { label: "Start here: Skool setup guide", detail: "Read first. Exact Hobby-plan setup steps and file-by-file instructions.", icon: BookOpenCheck, primary: true, action: () => download(`${name}-start-here-skool-setup.md`, skoolSetupGuide(project), "text/markdown") },
    { label: "Launch blueprint", detail: "Your master reference for the offer, member journey, engagement, and launch.", icon: FileText, action: () => download(`${name}-blueprint.md`, toMarkdown(project), "text/markdown") },
    { label: "Community setup", detail: "Reference for manually creating categories and tags in the Community tab.", icon: FileSpreadsheet, action: () => download(`${name}-community.csv`, communityToCsv(project), "text/csv") },
    { label: "Classroom", detail: "Reference for manually building modules and lesson pages in the Classroom tab.", icon: FileSpreadsheet, action: () => download(`${name}-classroom.csv`, classroomToCsv(project), "text/csv") },
    { label: "Campaign pack", detail: "Thirty-day launch plan, five posts, three emails, and referral campaign.", icon: FileText, action: () => download(`${name}-campaign.md`, campaignToMarkdown(project), "text/markdown") },
    { label: "Project data", detail: "Community Foundry backup only. This JSON is not uploaded to Skool.", icon: FileJson, action: () => download(`${name}.json`, toJson(project), "application/json") },
  ];

  return <section className="export-center">
    <header><div><small>SKOOL HOBBY READY</small><h2>Your guided launch package</h2></div><Download size={22}/></header>
    <ol className="export-use-order" aria-label="How to use the launch package">
      <li><span>1</span><div><b>Read the setup guide</b><small>It maps every download to the exact place it belongs in Skool.</small></div></li>
      <li><span>2</span><div><b>Build inside Skool</b><small>Copy your settings, categories, classroom, and lessons in order.</small></div></li>
      <li><span>3</span><div><b>Add images and test</b><small>Download Brand Studio assets, then check desktop and mobile.</small></div></li>
      <li><span>4</span><div><b>Launch the campaign</b><small>Use the outreach, posts, emails, and thirty-day calendar.</small></div></li>
    </ol>
    <div className="export-file-grid">{files.map(file => <button className={file.primary ? "primary-export" : ""} key={file.label} onClick={file.action}><file.icon size={18}/><span><b>{file.label}</b><small>{file.detail}</small></span><Download size={14}/></button>)}</div>
    <footer><ImageIcon size={14}/> Complete lesson packs download from each Classroom Lesson Studio. Brand images download individually from Brand Studio.</footer>
  </section>;
}
