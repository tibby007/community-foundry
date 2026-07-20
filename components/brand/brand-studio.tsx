"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Download, ImageIcon, RefreshCw } from "lucide-react";
import type { CommunityProject } from "@/domain/project-schema";
import { createBrandAssetDataUrl, getBrandTheme, type BrandDirection } from "@/lib/brand-system";

const assets = [
  { type: "icon", field: "iconUrl", label: "Community icon", width: 180, height: 180 },
  { type: "cover", field: "coverUrl", label: "Community cover", width: 480, height: 240 },
  { type: "promotion", field: "promotionUrl", label: "Launch graphic", width: 240, height: 240 },
] as const;
const directions: BrandDirection[] = ["authority", "energetic", "premium", "warm", "bold"];

export function BrandStudio({ project, onChange }: { project: CommunityProject; onChange?: (project: CommunityProject, path: string) => void }) {
  const [generated, setGenerated] = useState<Record<string, { url: string; provider: string }>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const fallbackFor = (asset: typeof assets[number]) => createBrandAssetDataUrl({ assetType: asset.type, communityName: project.foundation.name, promise: project.foundation.promise, palette: project.brand.palette });
  const changeDirection = (direction: BrandDirection) => {
    setGenerated({});
    onChange?.({ ...project, brand: { ...project.brand, direction, ...getBrandTheme(direction), iconUrl: null, coverUrl: null, promotionUrl: null } }, "brand");
  };
  async function generate(asset: typeof assets[number]) {
    setLoading(asset.type);
    try {
      const response = await fetch("/api/images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetType: asset.type, prompt: `${project.foundation.name}. ${project.foundation.promise}. ${project.brand.direction} visual direction using ${project.brand.palette.join(", ")}.`, communityName: project.foundation.name, promise: project.foundation.promise, palette: project.brand.palette }) });
      if (!response.ok) throw new Error("Image generation failed");
      const result = await response.json() as { url: string; provider: string };
      setGenerated((current) => ({ ...current, [asset.type]: result }));
    } finally { setLoading(null); }
  }
  function select(asset: typeof assets[number], url: string) { onChange?.({ ...project, brand: { ...project.brand, [asset.field]: url } }, `brand.${asset.field}`); }
  return <div className="brand-studio">
    <div className="brand-direction"><span><ImageIcon size={17}/> Visual direction</span><div className="direction-buttons">{directions.map((direction) => <button className={project.brand.direction === direction ? "selected" : ""} key={direction} onClick={() => changeDirection(direction)}>{direction}</button>)}</div><div>{project.brand.palette.map((color) => <i key={color} style={{ background: color }} title={color}/>)}</div><p>{project.brand.typography}</p></div>
    <div className="brand-assets">{assets.map((asset) => { const result = generated[asset.type]; const src = result?.url ?? fallbackFor(asset); const selected = project.brand[asset.field] === src; return <article key={asset.type}><div className={`asset-frame ${asset.type}`}><Image unoptimized src={src} alt={`${project.foundation.name} ${asset.label}`} width={asset.width} height={asset.height}/></div><footer><div><b>{asset.label}</b><small>{result?.provider === "openai" ? "Generated with OpenAI" : result ? "Custom fallback" : "Live brand preview"}</small></div><a href={src} download={`${project.foundation.name}-${asset.type}.svg`}><Download size={15}/><span className="sr-only">Download {asset.label}</span></a><button disabled={loading === asset.type} onClick={() => generate(asset)} aria-label={`Generate variation for ${asset.label}`}><RefreshCw size={15}/></button><button className={selected ? "selected-asset" : ""} onClick={() => select(asset, src)} aria-label={`Use ${asset.label}`}>{selected ? <Check size={15}/> : "Use"}</button></footer></article>; })}</div>
  </div>;
}
