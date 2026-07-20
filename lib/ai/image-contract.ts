import {z} from "zod";
export const ImageRequestSchema=z.object({assetType:z.enum(["icon","cover","promotion","lesson"]),prompt:z.string().min(8).max(1000),communityName:z.string().min(2).max(160).optional(),promise:z.string().min(2).max(500).optional(),palette:z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).length(4).optional()});
export type ImageRequest=z.infer<typeof ImageRequestSchema>;
export const imageSizes:Record<ImageRequest["assetType"],"1024x1024"|"1536x1024"|"1024x1536">={icon:"1024x1024",cover:"1536x1024",promotion:"1024x1024",lesson:"1536x1024"};
export const imageGenerationTimeoutMs = 20_000;
