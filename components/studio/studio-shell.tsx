"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Sparkles, Undo2 } from "lucide-react";
import type { CommunityProject } from "@/domain/project-schema";
import { applyProposal, undoLastChange, type ProjectProposal, type ProposalSection } from "@/domain/proposals";
import { ClassroomEditor } from "@/components/studio/classroom-editor";
import { EngagementEditor } from "@/components/studio/engagement-editor";
import { LaunchScore } from "@/components/score/launch-score";
import { MarketValidation } from "@/components/studio/market-validation";
import { PromotionEditor } from "@/components/studio/promotion-editor";
import { INITIAL_SCORE_VALUES,type ScoreValues } from "@/domain/scoring";
import { BrandStudio } from "@/components/brand/brand-studio";
import { ExportCenter } from "@/components/export/export-center";
import { CapabilityReport } from "@/components/skool/capability-report";
import { OfferEditor } from "@/components/studio/offer-editor";
import { CommunityEditor } from "@/components/studio/community-editor";

const steps = ["Foundation", "Offer", "Community", "Classroom", "Engagement", "Brand", "Promotion", "Launch"];

export function StudioShell({ initialProject, storageKey }: { initialProject: CommunityProject; storageKey?: string }) {
  const [project, setProject] = useState(initialProject);
  const [active, setActive] = useState("Foundation");
  const [applied, setApplied] = useState(false);
  const [scoreValues, setScoreValues] = useState<ScoreValues>(INITIAL_SCORE_VALUES);
  const [previewMode, setPreviewMode] = useState<"desktop"|"mobile">("desktop");
  const [whyOpen, setWhyOpen] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<ProjectProposal|null>(null);
  const [generationStatus, setGenerationStatus] = useState<"idle"|"loading"|"error">("idle");
  const tier = project.offer.tiers[0];

  const categoryPreview = useMemo(() => project.categories.slice(0, 4), [project.categories]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(`community-foundry.project.${storageKey ?? project.id}`, JSON.stringify(project));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [project, storageKey]);

  function applySuggestion() {
    setProject((current) => applyProposal(current, {
      id: "demo-foundation-suggestion",
      section: "foundation",
      changes: {
        "foundation.name": "The Second Act Consulting Lab",
        "foundation.promise": "Turn your corporate experience into a focused consulting offer and land your first five clients.",
      },
    }).project);
    setApplied(true);
  }

  function acceptManualEdit(next: CommunityProject, path: string) {
    setProject({ ...next, updatedAt: new Date().toISOString(), lockedPaths: [...new Set([...next.lockedPaths, path])] });
  }

  async function regenerateSection() {
    if (["Brand","Launch"].includes(active)) return;
    setGenerationStatus("loading");
    setPendingProposal(null);
    try {
      const section=active.toLowerCase() as ProposalSection;
      const response=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project,section,instruction:`Improve the ${section} section while preserving accepted user choices.`})});
      if(!response.ok) throw new Error("Generation failed");
      const result=await response.json() as {proposal:{id:string;section:ProposalSection;changes:Array<{path:string;value:unknown}>}};
      setPendingProposal({id:result.proposal.id,section:result.proposal.section,changes:Object.fromEntries(result.proposal.changes.map(change=>[change.path,change.value]))});
      setGenerationStatus("idle");
    } catch { setGenerationStatus("error"); }
  }

  return (
    <main className="studio-app">
      <header className="studio-app-header">
        <Link href="/" className="studio-brand"><span>CF</span> Community Foundry</Link>
        <div className="project-name"><small>PROJECT</small><strong>{project.foundation.name}</strong></div>
        <div className="save-indicator"><Check size={14} /> Saved in this browser</div>
      </header>

      <div className="studio-grid">
        <aside className="build-sidebar">
          <Link href="/" className="back-link"><ArrowLeft size={15} /> Back to templates</Link>
          <p>BUILD YOUR COMMUNITY</p>
          {steps.map((step, index) => (
            <button aria-label={`${String(index + 1).padStart(2, "0")} ${step}`} className={active === step ? "rail-step selected" : "rail-step"} key={step} onClick={() => setActive(step)}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b>{index < 3 && <Check size={12} />}
            </button>
          ))}
          <div className="completion"><span><i style={{ width: "38%" }} /></span><small>38% launch-ready</small></div>
        </aside>

        <section className="studio-workspace">
          <div className="workspace-heading"><div><p>STEP {steps.indexOf(active) + 1} OF 8</p><h1>{active}</h1></div><button onClick={() => setProject((value) => undoLastChange(value))}><Undo2 size={15} /> Undo</button></div>
          <p className="workspace-intro">{active === "Classroom" ? "Turn the transformation into a clear member journey." : active === "Engagement" ? "Create the habits that keep members participating and renewing." : "Shape the promise people will immediately understand and want to be part of."}</p>

          {active === "Launch" ? <><LaunchScore values={scoreValues}/><MarketValidation templateId={project.templateId === "custom" ? "consulting-client-accelerator" : project.templateId}/><ExportCenter project={project}/><CapabilityReport/></> : active === "Brand" ? <BrandStudio project={project} onChange={acceptManualEdit}/> : active === "Promotion" ? <PromotionEditor project={project} values={scoreValues} onChange={acceptManualEdit} onApply={()=>setScoreValues({...scoreValues,transformationClarity:87,willingnessToPay:90,engagementRetention:90,acquisitionFeasibility:95})}/> : active === "Classroom" ? <ClassroomEditor project={project} onChange={acceptManualEdit} /> : active === "Engagement" ? <EngagementEditor project={project} onChange={acceptManualEdit} /> : active === "Offer" ? <OfferEditor project={project} onChange={acceptManualEdit}/> : active === "Community" ? <CommunityEditor project={project} onChange={acceptManualEdit}/> : <><div className="editor-card section-form">
            <label>Community name<input value={project.foundation.name} onChange={(event) => setProject({ ...project, foundation: { ...project.foundation, name: event.target.value }, lockedPaths: [...new Set([...project.lockedPaths, "foundation.name"])] })} /></label>
            <label>Community promise<textarea value={project.foundation.promise} onChange={(event) => setProject({ ...project, foundation: { ...project.foundation, promise: event.target.value }, lockedPaths: [...new Set([...project.lockedPaths, "foundation.promise"])] })} /></label>
            <label>Ideal member<textarea value={project.foundation.audience} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,audience:event.target.value}},"foundation.audience")} /></label>
            <label>Current pain<textarea value={project.foundation.pain} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,pain:event.target.value}},"foundation.pain")} /></label>
            <label>Desired transformation<textarea value={project.foundation.transformation} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,transformation:event.target.value}},"foundation.transformation")} /></label>
            <label>Differentiating angle<textarea value={project.foundation.differentiator} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,differentiator:event.target.value}},"foundation.differentiator")} /></label>
            <label>Founder authority<textarea value={project.foundation.authority} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,authority:event.target.value}},"foundation.authority")} /></label>
            <label>Membership criteria<textarea value={project.foundation.membershipCriteria} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,membershipCriteria:event.target.value}},"foundation.membershipCriteria")} /></label>
            <label>Rules<textarea value={project.foundation.rules.join("\n")} onChange={(event)=>acceptManualEdit({...project,foundation:{...project.foundation,rules:event.target.value.split("\n").filter(Boolean)}},"foundation.rules")} /></label>
          </div>

          <div className="offer-strip"><div><small>RECOMMENDED MODEL</small><strong>{project.offer.model} · ${tier.monthlyPrice}/month</strong></div><div><small>FOUNDING OFFER</small><span>{project.offer.foundingOffer}</span></div></div>
          </>}
        </section>

        <section className="studio-preview-panel">
          <div className="preview-header"><span>LIVE PREVIEW</span><div><button className={previewMode==="desktop"?"active":""} aria-pressed={previewMode==="desktop"} onClick={()=>setPreviewMode("desktop")}>Desktop</button><button className={previewMode==="mobile"?"active":""} aria-pressed={previewMode==="mobile"} onClick={()=>setPreviewMode("mobile")}>Mobile</button></div></div>
          <div className={previewMode==="mobile"?"community-live-preview mobile-preview":"community-live-preview"} aria-label="Community preview">
            <div className="preview-cover"><small>WELCOME TO</small><strong>{project.foundation.name}</strong></div>
            <div className="preview-community-title"><div>{project.foundation.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div><section><strong>{project.foundation.name}</strong><p>{project.foundation.promise}</p></section></div>
            <nav><b>{active==="Offer"?"Membership":active==="Classroom"?"Classroom":"Community"}</b><span>Classroom</span><span>Calendar</span><span>Members</span></nav>
            {active==="Offer"?<div className="offer-preview"><small>FOUNDING MEMBER</small><strong>${tier.monthlyPrice}<span>/month</span></strong><p>{project.offer.foundingOffer}</p>{tier.benefits.map(benefit=><div key={benefit}><Check size={13}/>{benefit}</div>)}</div>:active==="Classroom"?<div className="classroom-preview">{project.classroom.modules.map((module,index)=><div key={module.id}><span>{index+1}</span><section><b>{module.title}</b><small>{module.lessons.length} lessons · {module.milestone}</small></section></div>)}</div>:active==="Promotion"?<div className="launch-preview"><small>FOUNDING DOORS ARE OPEN</small><strong>{project.promotion.leadMagnet}</strong><p>{project.promotion.referralCampaign}</p></div>:<div className="category-grid">{categoryPreview.map((category) => <div key={category.id}><span>{category.emoji}</span><section><b>{category.name}</b><small>{category.description}</small></section><ChevronRight size={14} /></div>)}</div>}
          </div>

          <div className={applied ? "coach-card applied" : "coach-card"}>
            <div className="coach-label"><Sparkles size={14} /> AI COACH <span>High confidence</span></div>
            <p>{applied ? "Nice. Your promise now names a clear outcome and gives the member something measurable to work toward." : "Your audience is strong, but the promise needs a measurable outcome. Make the first five clients the finish line."}</p>
            {whyOpen&&<p className="coach-explanation">A measurable finish line makes the offer easier to understand, price, and promote. It also gives members a shared definition of progress.</p>}
            {generationStatus==="loading"&&<p role="status">Generating a focused {active.toLowerCase()} recommendation…</p>}
            {generationStatus==="error"&&<p role="alert">The recommendation timed out. Your project is unchanged. <button onClick={regenerateSection}>Retry</button></p>}
            {pendingProposal&&<p>A validated recommendation is ready. Locked edits will be preserved.</p>}
            <div className="coach-actions"><button onClick={pendingProposal?()=>{setProject(applyProposal(project,pendingProposal).project);setPendingProposal(null)}:applySuggestion} disabled={applied&&!pendingProposal}>{pendingProposal?"Apply regenerated suggestion":applied?"Suggestion applied":"Apply suggestion"}</button><button onClick={()=>setWhyOpen(value=>!value)}>Ask why</button><button onClick={regenerateSection} disabled={generationStatus==="loading"||["Brand","Launch"].includes(active)}>Regenerate section</button></div>
          </div>
        </section>
      </div>
    </main>
  );
}
