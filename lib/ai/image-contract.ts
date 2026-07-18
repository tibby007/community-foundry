import {z} from "zod";
export const ImageRequestSchema=z.object({assetType:z.enum(["icon","cover","promotion"]),prompt:z.string().min(8).max(1000)});
export type ImageRequest=z.infer<typeof ImageRequestSchema>;
export const imageSizes:Record<ImageRequest["assetType"],string>={icon:"1024x1024",cover:"1536x768",promotion:"1080x1080"};
