"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Blocks, Sparkles } from "lucide-react";
import { COMMUNITY_TEMPLATES, createProjectFromTemplate } from "@/data/templates";

export function EntryExperience() {
  const [idea, setIdea] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const router = useRouter();

  function start(templateId = "consulting-client-accelerator") {
    const audience = idea.trim() || "Creators ready to turn expertise into a community business";
    const project = createProjectFromTemplate(templateId, audience);
    window.localStorage.setItem(`community-foundry.project.${project.id}`, JSON.stringify(project));
    router.push(`/build/${project.id}`);
  }

  return <>
    <div className="hero-copy">
      <p className="eyebrow"><Sparkles size={15} /> Community to business, in minutes</p>
      <h1>Turn what you know into a community people want to join.</h1>
      <p className="lede">Build the offer, classroom, conversations, brand, and launch plan in one AI-guided studio.</p>
      <div className="idea-card"><label htmlFor="community-idea">What could you teach, lead, or help people achieve?</label><div className="idea-row"><input id="community-idea" aria-label="Describe your community idea" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="I help women over 40 launch consulting businesses..."/><button onClick={() => start()}>Build my community <ArrowRight size={17}/></button></div><p>No polished idea required. The strategist will help shape it.</p></div>
      <div className="divider"><span>or</span></div>
      <button className="template-button" onClick={() => setShowTemplates(!showTemplates)}><span className="template-icon"><Blocks size={20}/></span><span><strong>Start with a proven template</strong><small>Explore 10 market-tested community models</small></span><ArrowRight size={18}/></button>
    </div>
    {showTemplates && <div className="template-drawer"><div><span>PROVEN STARTING POINTS</span><button onClick={() => setShowTemplates(false)}>Close</button></div>{COMMUNITY_TEMPLATES.map((template) => <button key={template.id} onClick={() => start(template.id)}><strong>{template.foundation.name}</strong><span>{template.foundation.transformation}</span><small>{template.offer.model} · ${template.offer.tiers[0].monthlyPrice}/mo</small></button>)}</div>}
  </>;
}
