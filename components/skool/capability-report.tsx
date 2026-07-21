import { CheckCircle2, Download, PlugZap } from "lucide-react";

export function CapabilityReport() {
  return <section className="capability-report">
    <header><div><small>CHOOSE YOUR SKOOL PATH</small><h2>Launch on any Skool plan</h2></div><PlugZap size={22}/></header>
    <p>Community Foundry never blocks your launch because you do not have an integration.</p>
    <div className="plan-modes">
      <article className="plan-mode selected-plan">
        <CheckCircle2 size={19}/>
        <div><b>Skool Hobby: guided setup</b><strong>No connection required</strong><p>Use the Start Here guide, copy-ready files, lesson packs, and brand downloads to build the group manually.</p></div>
        <Download size={17}/>
      </article>
      <article className="plan-mode">
        <PlugZap size={19}/>
        <div><b>Skool Pro: optional automation</b><strong>Upgrade only when it earns its keep</strong><p>Zapier is optional and requires Skool Pro. It supports member invitations and course unlocks, not full community publishing.</p></div>
      </article>
    </div>
    <footer>Community creation, categories, lessons, posts, and branding use the guided setup on both plans.</footer>
  </section>;
}
