import type { CommunityProject } from "@/domain/project-schema";

export type BrandDirection = CommunityProject["brand"]["direction"];

export const BRAND_THEMES: Record<BrandDirection, { palette: [string, string, string, string]; typography: string }> = {
  authority: { palette: ["#11263D", "#2E5B88", "#D29B45", "#F4F1EA"], typography: "Classic serif headlines with a confident, highly readable sans serif interface." },
  energetic: { palette: ["#1B1B24", "#F04438", "#FFD166", "#FFF7EC"], typography: "Bold geometric headlines with an open, fast-moving sans serif interface." },
  premium: { palette: ["#211A24", "#6F4E5E", "#C5A46D", "#FBF8F2"], typography: "Refined editorial headlines with a restrained, high-legibility sans serif interface." },
  warm: { palette: ["#2F3B2E", "#A65232", "#D8A65A", "#FAF3E7"], typography: "Humanist serif headlines with a welcoming, relaxed sans serif interface." },
  bold: { palette: ["#101820", "#007C83", "#FFB000", "#F1F7F5"], typography: "Condensed display headlines with a crisp, decisive sans serif interface." },
};

export function getBrandTheme(direction: BrandDirection) {
  const theme = BRAND_THEMES[direction];
  return { palette: [...theme.palette], typography: theme.typography };
}

export function recommendBrandDirection(subject: string): BrandDirection {
  const normalized = subject.toLowerCase();
  const signals: Record<BrandDirection, string[]> = {
    warm: ["garden", "home", "wellness", "family", "food", "care", "craft", "healing", "relationship", "mindful"],
    energetic: ["fitness", "creator", "content", "social", "sport", "dance", "youth", "habit", "challenge"],
    bold: ["ai ", "agent", "technology", "automation", "gaming", "startup", "innovation", "sales", "growth"],
    authority: ["finance", "career", "education", "legal", "real estate", "nonprofit", "leadership", "invest", "professional"],
    premium: ["luxury", "consult", "executive", "business", "strategy", "brand", "design", "mastermind"],
  };
  const scored = (Object.entries(signals) as [BrandDirection, string[]][]).map(([direction, words]) => ({ direction, score: words.filter((word) => normalized.includes(word)).length }));
  const best = scored.sort((a, b) => b.score - a.score)[0];
  if (best.score > 0) return best.direction;
  const options: BrandDirection[] = ["authority", "energetic", "premium", "warm", "bold"];
  const hash = [...normalized].reduce((total, character) => total + character.charCodeAt(0), 0);
  return options[hash % options.length];
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character] ?? character);
const fit = (value: string, max = 42) => value.length > max ? `${value.slice(0, max - 1).trim()}…` : value;
const wrapWords = (value: string, maxPerLine: number) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const current = lines.at(-1);
    if (!current || (current.length + word.length + 1 > maxPerLine && lines.length < 2)) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
  }
  if (lines.length > 2) lines[1] = lines.slice(1).join(" ");
  return lines.slice(0, 2).map((line) => fit(line, maxPerLine + 8));
};

export function createBrandAssetDataUrl(input: { assetType: "icon" | "cover" | "promotion" | "lesson"; communityName: string; promise: string; palette: string[] }) {
  const [ink = "#11263D", primary = "#2E5B88", accent = "#D29B45", surface = "#F4F1EA"] = input.palette;
  const nameLines = wrapWords(input.communityName, input.assetType === "cover" ? 28 : 23).map(escapeXml);
  const promise = escapeXml(fit(input.promise, input.assetType === "cover" ? 76 : 54));
  const initials = escapeXml(input.communityName.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join(""));
  const dimensions = input.assetType === "cover" ? [1200, 600] : input.assetType === "lesson" ? [1200, 800] : [1080, 1080];
  const [width, height] = dimensions;
  const body = input.assetType === "icon"
    ? `<circle cx="540" cy="540" r="350" fill="${surface}" opacity=".16"/><path d="M540 238c122 95 214 211 214 350 0 118-96 214-214 214s-214-96-214-214c0-139 92-255 214-350Z" fill="${accent}" opacity=".9"/><text x="540" y="635" text-anchor="middle" fill="${ink}" font-size="190" font-family="Arial,sans-serif" font-weight="800">${initials}</text>`
    : `<circle cx="${width * .84}" cy="${height * .15}" r="${height * .32}" fill="${accent}" opacity=".2"/><path d="M0 ${height * .82} C ${width * .25} ${height * .58}, ${width * .55} ${height * 1.08}, ${width} ${height * .68} L ${width} ${height} L 0 ${height} Z" fill="${ink}" opacity=".28"/><text x="${width * .09}" y="${height * .2}" fill="${surface}" font-size="${input.assetType === "cover" ? 24 : 30}" font-family="Arial,sans-serif" font-weight="700" letter-spacing="5">${input.assetType === "promotion" ? "FOUNDING MEMBERS" : input.assetType === "lesson" ? "LESSON VISUAL" : "WELCOME TO"}</text><text x="${width * .09}" y="${nameLines.length > 1 ? height * .36 : height * .43}" fill="white" font-size="${input.assetType === "cover" ? 62 : 58}" font-family="Georgia,serif" font-weight="700">${nameLines.map((line, index) => `<tspan x="${width * .09}" dy="${index === 0 ? 0 : input.assetType === "cover" ? 70 : 66}">${line}</tspan>`).join("")}</text><text x="${width * .09}" y="${height * .6}" fill="${surface}" font-size="${input.assetType === "cover" ? 27 : 25}" font-family="Arial,sans-serif">${promise}</text><rect x="${width * .09}" y="${height * .7}" width="${width * .24}" height="${height * .09}" rx="${height * .045}" fill="${accent}"/><text x="${width * .21}" y="${height * .758}" text-anchor="middle" fill="${ink}" font-size="${input.assetType === "cover" ? 20 : 24}" font-family="Arial,sans-serif" font-weight="800">${input.assetType === "lesson" ? "START LESSON" : "JOIN THE COMMUNITY"}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${ink}"/></linearGradient></defs><rect width="${width}" height="${height}" rx="${input.assetType === "icon" ? 190 : 48}" fill="url(#brand)"/>${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function migrateLegacyBrand(project: CommunityProject): CommunityProject {
  const isLegacy = project.brand.palette.join(",").toUpperCase() === "#17151F,#7657FF,#A6F1CE,#FFFDF8";
  if (!isLegacy) return project;
  const theme = getBrandTheme(project.brand.direction);
  return { ...project, brand: { ...project.brand, ...theme, iconUrl: null, coverUrl: null, promotionUrl: null } };
}
