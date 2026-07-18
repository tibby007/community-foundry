import type { CommunityProject } from "@/domain/project-schema";

export function OfferEditor({ project, onChange }: { project: CommunityProject; onChange: (project: CommunityProject, path: string) => void }) {
  const tier = project.offer.tiers[0];
  const updateOffer = (changes: Partial<CommunityProject["offer"]>, path: string) => onChange({ ...project, offer: { ...project.offer, ...changes } }, path);
  const updateTier = (changes: Partial<typeof tier>, path: string) => updateOffer({ tiers: [{ ...tier, ...changes }, ...project.offer.tiers.slice(1)] }, path);
  return <div className="editor-card section-form">
    <label>Membership model<select value={project.offer.model} onChange={(event) => updateOffer({ model: event.target.value as CommunityProject["offer"]["model"] }, "offer.model")}><option value="free">Free</option><option value="freemium">Freemium</option><option value="paid">Paid</option><option value="cohort">Cohort</option><option value="tiered">Tiered</option></select></label>
    <label>Why this model<textarea value={project.offer.rationale} onChange={(event) => updateOffer({ rationale: event.target.value }, "offer.rationale")}/></label>
    <label>Founding offer<textarea value={project.offer.foundingOffer} onChange={(event) => updateOffer({ foundingOffer: event.target.value }, "offer.foundingOffer")}/></label>
    <div className="field-pair"><label>Tier name<input value={tier.name} onChange={(event) => updateTier({ name: event.target.value }, "offer.tiers.0.name")}/></label><label>Monthly price<input type="number" min="0" value={tier.monthlyPrice} onChange={(event) => updateTier({ monthlyPrice: Number(event.target.value), annualPrice: Number(event.target.value) * 10 }, "offer.tiers.0.monthlyPrice")}/></label></div>
    <label>Included benefits<textarea value={tier.benefits.join("\n")} onChange={(event) => updateTier({ benefits: event.target.value.split("\n").filter(Boolean) }, "offer.tiers.0.benefits")}/></label>
    <label>Trial recommendation<textarea value={project.offer.trialRecommendation} onChange={(event) => updateOffer({ trialRecommendation: event.target.value }, "offer.trialRecommendation")}/></label>
    <label>Risk reversal<textarea value={project.offer.riskReversal} onChange={(event) => updateOffer({ riskReversal: event.target.value }, "offer.riskReversal")}/></label>
    <div className="revenue-strip"><small>ARITHMETIC ILLUSTRATIONS, NOT FORECASTS</small><b>25 members: ${project.offer.revenueScenarios.members25}/mo</b><b>100: ${project.offer.revenueScenarios.members100}/mo</b><b>500: ${project.offer.revenueScenarios.members500}/mo</b></div>
  </div>;
}
