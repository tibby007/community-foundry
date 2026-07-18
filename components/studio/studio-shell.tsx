"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Sparkles, Undo2 } from "lucide-react";
import type { CommunityProject } from "@/domain/project-schema";
import { applyProposal, undoLastChange } from "@/domain/proposals";
import { ClassroomEditor } from "@/components/studio/classroom-editor";
import { EngagementEditor } from "@/components/studio/engagement-editor";
import { LaunchScore } from "@/components/score/launch-score";
import { MarketValidation } from "@/components/studio/market-validation";
import { PromotionEditor } from "@/components/studio/promotion-editor";
import { INITIAL_SCORE_VALUES,type ScoreValues } from "@/domain/scoring";

const steps = ["Foundation", "Offer", "Community", "Classroom", "Engagement", "Brand", "Promotion", "Launch"];

export function StudioShell({ initialProject }: { initialProject: CommunityProject }) {
  const [project, setProject] = useState(initialProject);
  const [active, setActive] = useState("Foundation");
  const [applied, setApplied] = useState(false);
  const [scoreValues, setScoreValues] = useState<ScoreValues>(INITIAL_SCORE_VALUES);
  const tier = project.offer.tiers[0];

  const categoryPreview = useMemo(() => project.categories.slice(0, 4), [project.categories]);

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
            <button className={active === step ? "rail-step selected" : "rail-step"} key={step} onClick={() => setActive(step)}>
              <span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b>{index < 3 && <Check size={12} />}
            </button>
          ))}
          <div className="completion"><span><i style={{ width: "38%" }} /></span><small>38% launch-ready</small></div>
        </aside>

        <section className="studio-workspace">
          <div className="workspace-heading"><div><p>STEP {steps.indexOf(active) + 1} OF 8</p><h1>{active}</h1></div><button onClick={() => setProject((value) => undoLastChange(value))}><Undo2 size={15} /> Undo</button></div>
          <p className="workspace-intro">{active === "Classroom" ? "Turn the transformation into a clear member journey." : active === "Engagement" ? "Create the habits that keep members participating and renewing." : "Shape the promise people will immediately understand and want to be part of."}</p>

          {active === "Launch" ? <><LaunchScore values={scoreValues}/><MarketValidation templateId={project.templateId}/></> : active === "Promotion" ? <PromotionEditor project={project} values={scoreValues} onApply={()=>setScoreValues({...scoreValues,transformationClarity:87,willingnessToPay:90,engagementRetention:90,acquisitionFeasibility:95})}/> : active === "Classroom" ? <ClassroomEditor project={project} /> : active === "Engagement" ? <EngagementEditor project={project} /> : <><div className="editor-card">
            <label>Community name<input value={project.foundation.name} onChange={(event) => setProject({ ...project, foundation: { ...project.foundation, name: event.target.value }, lockedPaths: [...new Set([...project.lockedPaths, "foundation.name"])] })} /></label>
            <label>Community promise<textarea value={project.foundation.promise} onChange={(event) => setProject({ ...project, foundation: { ...project.foundation, promise: event.target.value }, lockedPaths: [...new Set([...project.lockedPaths, "foundation.promise"])] })} /></label>
            <label>Ideal member<textarea value={project.foundation.audience} readOnly /></label>
          </div>

          <div className="offer-strip"><div><small>RECOMMENDED MODEL</small><strong>{project.offer.model} · ${tier.monthlyPrice}/month</strong></div><div><small>FOUNDING OFFER</small><span>{project.offer.foundingOffer}</span></div></div>
          </>}
        </section>

        <section className="studio-preview-panel">
          <div className="preview-header"><span>LIVE PREVIEW</span><div><button className="active">Desktop</button><button>Mobile</button></div></div>
          <div className="community-live-preview" aria-label="Community preview">
            <div className="preview-cover"><small>WELCOME TO</small><strong>{project.foundation.name}</strong></div>
            <div className="preview-community-title"><div>{project.foundation.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div><section><strong>{project.foundation.name}</strong><p>{project.foundation.promise}</p></section></div>
            <nav><b>Community</b><span>Classroom</span><span>Calendar</span><span>Members</span></nav>
            <div className="category-grid">{categoryPreview.map((category) => <div key={category.id}><span>{category.emoji}</span><section><b>{category.name}</b><small>{category.description}</small></section><ChevronRight size={14} /></div>)}</div>
          </div>

          <div className={applied ? "coach-card applied" : "coach-card"}>
            <div className="coach-label"><Sparkles size={14} /> AI COACH <span>High confidence</span></div>
            <p>{applied ? "Nice. Your promise now names a clear outcome and gives the member something measurable to work toward." : "Your audience is strong, but the promise needs a measurable outcome. Make the first five clients the finish line."}</p>
            <button onClick={applySuggestion} disabled={applied}>{applied ? "Suggestion applied" : "Apply suggestion"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
