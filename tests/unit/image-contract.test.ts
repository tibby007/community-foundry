import {describe,expect,it} from "vitest";
import {ImageRequestSchema} from "@/lib/ai/image-contract";
describe("image request",()=>{it("accepts supported assets and rejects unknown types",()=>{expect(ImageRequestSchema.safeParse({assetType:"cover",prompt:"Premium consulting community"}).success).toBe(true);expect(ImageRequestSchema.safeParse({assetType:"lesson",prompt:"Educational diagram for an AI agent lesson"}).success).toBe(true);expect(ImageRequestSchema.safeParse({assetType:"unknown",prompt:"x"}).success).toBe(false)})});
