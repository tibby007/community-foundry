"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Sparkles, Undo2 } from "lucide-react";
import type { CommunityProject } from "@/domain/project-schema";
import { applyManualChange, applyProposal, undoLastChange, type ProjectProposal, type ProposalSection } from "@/domain/proposals";
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

const steps = ["Foundation", "Offer", "Community", "Classroom", "Engagement", "Brand", "Promotion", "Launch"] as const;
type StudioStep = typeof steps[number];

const stageGuidance: Record<StudioStep, { intro: string; next: string; coach: string }> = {
  Foundation: { intro: "Define exactly who this community serves, what they will achieve, and why your approach is different.", next: "Shape how members will join and pay", coach: "Strengthen the promise with a specific result and a visible first milestone." },
  Offer: { intro: "Choose the membership model, founding price, benefits, and risk reversal.", next: "Design the member experience", coach: "Make the founding offer easy to understand and valuable enough to act on now." },
  Community: { intro: "Create the conversations, categories, onboarding, and rules that make participation useful.", next: "Build the learning journey", coach: "Give every new member one clear first action and one reason to participate." },
  Classroom: { intro: "Turn the transformation into a clear member journey with practical milestones.", next: "Plan engagement and retention", coach: "Make every module end with a concrete deliverable members can share." },
  Engagement: { intro: "Create the habits that keep members participating, progressing, and renewing.", next: "Choose the visual direction", coach: "Build an early win into the first day and a repeatable weekly ritual." },
  Brand: { intro: "Choose a visual direction and create assets that make the community feel credible and distinct.", next: "Create the promotion plan", coach: "Use the Brand Studio controls to generate and select each visual asset." },
  Promotion: { intro: "Plan how you will attract the first 25 members and build momentum during launch.", next: "Review launch readiness and export", coach: "Lead with the member's problem, show the path, and give founding members a reason to join now." },
  Launch: { intro: "Review the plan, address the weakest launch signals, and export everything needed to build the community.", next: "Launch your community", coach: "Your launch package is ready for a final review and export." },
};

export function StudioShell({ initialProject, storageKey }: { initialProject: CommunityProject; storageKey?: string }) {
  const [project, setProject] = useState(initialProject);
  const [active, setActive] = useState<StudioStep>("Foundation");
  const [applied, setApplied] = useState(false);
  const [scoreValues, setScoreValues] = useState<ScoreValues>(INITIAL_SCORE_VALUES);
  const [previewMode, setPreviewMode] = useState<"desktop"|"mobile">("desktop");
  const [whyOpen, setWhyOpen] = useState(false);
  const [pendingProposal, setPendingProposal] = useState<ProjectProposal|null>(null);
  const [generationStatus, setGenerationStatus] = useState<"idle"|"loading"|"error">("idle");
  const [generationInstruction, setGenerationInstruction] = useState("");
  const [undoNotice, setUndoNotice] = useState("");
  const tier = project.offer.tiers[0];
  const activeIndex = steps.indexOf(active);
  const nextStep = steps[activeIndex + 1];

  const categoryPreview = useMemo(() => project.categories.slice(0, 4), [project.categories]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(`community-foundry.project.${storageKey ?? project.id}`, JSON.stringify(project));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [project, storageKey]);

  function applySuggestion() {
    const isConsultingDemo = project.templateId === "consulting-client-accelerator";
    setProject((current) => applyProposal(current, {
      id: "demo-foundation-suggestion",
      section: "foundation",
      changes: {
        ...(isConsultingDemo ? { "foundation.name": "The Second Act Consulting Lab" } : {}),
        "foundation.promise": isConsultingDemo
          ? "Turn your corporate experience into a focused consulting offer and land your first five clients."
          : `${current.foundation.promise.replace(/[.]$/, "")} Complete a visible first milestone within 30 days.`,
      },
    }).project);
    setApplied(true);
  }

  function goToStep(step: StudioStep) {
    setActive(step);
    setApplied(false);
    setPendingProposal(null);
    setGenerationStatus("idle");
    setGenerationInstruction("");
    setWhyOpen(false);
  }

  function acceptManualEdit(next: CommunityProject, path: string) {
    setProject((current) => applyManualChange(current, next, path));
    setUndoNotice("");
  }

  function handleUndo() {
    setProject((current) => undoLastChange(current));
    setUndoNotice(project.history.length === 1 ? "Change undone. Nothing to undo yet." : "Last change undone.");
  }

  async function regenerateSection() {
    if (["Brand","Launch"].includes(active)) return;
    setGenerationStatus("loading");
    setPendingProposal(null);
    try {
      const section=active.toLowerCase() as ProposalSection;
      const instruction=generationInstruction.trim() || `Improve the ${section} section while preserving accepted user choices.`;
      const response=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project,section,instruction})});
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
            <button aria-label={`${String(index + 1).padStart(2, "0")} ${step}`} className={active === step ? "rail-step selected" : "rail-step"} key={step} onClick={() => goToStep(step)}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b>{index < 3 && <Check size={12} />}
            </button>
          ))}
          <div className="completion"><span><i style={{ width: "38%" }} /></span><small>38% launch-ready</small></div>
        </aside>

        <section className="studio-workspace">
          <div className="workspace-heading"><div><p>STEP {steps.indexOf(active) + 1} OF 8</p><h1>{active}</h1></div><button onClick={handleUndo} disabled={project.history.length === 0} title={project.history.length ? "Undo the last accepted or manual change" : "Nothing to undo yet"}><Undo2 size={15} /> Undo</button></div>
          {undoNotice && <p className="undo-notice" role="status">{undoNotice}</p>}
          <p className="workspace-intro">{stageGuidance[active].intro}</p>

          {active === "Launch" ? <><LaunchScore values={scoreValues}/><MarketValidation templateId={project.templateId}/><ExportCenter project={project}/><CapabilityReport/></> : active === "Brand" ? <BrandStudio project={project} onChange={acceptManualEdit}/> : active === "Promotion" ? <PromotionEditor project={project} values={scoreValues} onChange={acceptManualEdit} onApply={()=>setScoreValues({...scoreValues,transformationClarity:87,willingnessToPay:90,engagementRetention:90,acquisitionFeasibility:95})}/> : active === "Classroom" ? <ClassroomEditor project={project} onChange={acceptManualEdit} /> : active === "Engagement" ? <EngagementEditor project={project} onChange={acceptManualEdit} /> : active === "Offer" ? <OfferEditor project={project} onChange={acceptManualEdit}/> : active === "Community" ? <CommunityEditor project={project} onChange={acceptManualEdit}/> : <><div className="editor-card section-form">
            <label>Community name<input value={project.foundation.name} onChange={(event) => acceptManualEdit({ ...project, foundation: { ...project.foundation, name: event.target.value } }, "foundation.name")} /></label>
            <label>Community promise<textarea value={project.foundation.promise} onChange={(event) => acceptManualEdit({ ...project, foundation: { ...project.foundation, promise: event.target.value } }, "foundation.promise")} /></label>
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

          <div className="stage-navigation">
            <div><small>{nextStep ? "NEXT" : "FINAL STEP"}</small><strong>{nextStep ? stageGuidance[active].next : "Review your launch package and download the exports."}</strong></div>
            {nextStep && <button onClick={() => goToStep(nextStep)}>Continue to {nextStep} <ChevronRight size={15}/></button>}
          </div>
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
            <p>{pendingProposal ? `A focused ${active.toLowerCase()} recommendation is ready to review.` : applied ? "Applied. Your project now has a clearer, more actionable recommendation." : stageGuidance[active].coach}</p>
            {whyOpen&&<p className="coach-explanation">Specific outcomes and visible milestones make the community easier to understand, price, promote, and successfully complete.</p>}
            {generationStatus==="loading"&&<p role="status">Generating a focused {active.toLowerCase()} recommendation…</p>}
            {generationStatus==="error"&&<p role="alert">The recommendation timed out. Your project is unchanged. <button onClick={regenerateSection}>Retry</button></p>}
            {pendingProposal&&<p>A validated recommendation is ready. Your manual edits remain protected.</p>}
            {!(["Brand","Launch"] as StudioStep[]).includes(active) && <label className="coach-instruction">Tell AI what to improve in this section<input value={generationInstruction} onChange={(event)=>setGenerationInstruction(event.target.value)} placeholder={`Example: Make the ${active.toLowerCase()} more specific`}/></label>}
            <div className="coach-actions">{(pendingProposal||active==="Foundation")&&<button onClick={pendingProposal?()=>{setProject(applyProposal(project,pendingProposal).project);setPendingProposal(null);setApplied(true)}:applySuggestion} disabled={applied&&!pendingProposal}>{pendingProposal?"Apply regenerated suggestion":applied?"Suggestion applied":"Apply suggestion"}</button>}<button onClick={()=>setWhyOpen(value=>!value)}>Ask why</button><button aria-label={`Regenerate section: ${active}`} onClick={regenerateSection} disabled={generationStatus==="loading"||(["Brand","Launch"] as StudioStep[]).includes(active)}>Regenerate {active}</button></div>
          </div>
        </section>
      </div>
    </main>
  );
}
