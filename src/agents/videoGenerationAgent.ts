import { ChatOpenAI } from "@langchain/openai";
import { createAgent, SystemMessage } from "langchain";
import { z } from "zod";

const model = new ChatOpenAI({
  model: "gpt-4o", // Note: Sora is for video generation, not available via ChatOpenAI
  temperature: 0.3,
  maxTokens: 2000,
  timeout: 60000,
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for video scene
const VideoSceneSchema = z.object({
  sceneNumber: z.number().describe("Số thứ tự cảnh"),
  duration: z.string().describe("Thời lượng cảnh (vd: '3s', '5s')"),
  visualDescription: z.string().describe("Mô tả chi tiết hình ảnh cần generate"),
  imagePrompt: z.string().describe("Prompt để generate image/video cho cảnh này (tiếng Anh, chi tiết)"),
  transitionEffect: z.string().describe("Hiệu ứng chuyển cảnh (fade, slide, zoom, cut, dissolve, etc.)"),
});

// Schema for video generation plan
const VideoGenerationPlanSchema = z.object({
  totalDuration: z.string().describe("Tổng thời lượng video"),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).describe("Tỷ lệ khung hình (16:9 cho YouTube, 9:16 cho TikTok/Reels)"),
  scenes: z.array(VideoSceneSchema).describe("Danh sách các cảnh trong video"),
  audioDescription: z.string().describe("Mô tả về audio/voice-over"),
  musicStyle: z.string().describe("Phong cách nhạc nền đề xuất"),
  textOverlays: z.array(z.object({
    sceneNumber: z.number().describe("Cảnh nào hiển thị text này"),
    text: z.string().describe("Nội dung text"),
    style: z.string().describe("Style của text (bold, animated, subtitle, etc.)"),
  })).describe("Các text overlays trong video"),
  callToAction: z.object({
    text: z.string().describe("Text CTA"),
    position: z.string().describe("Vị trí CTA (center, bottom, end screen)"),
  }),
});

export const videoGenerationAgent = createAgent({
  model,
  tools: [],
  systemPrompt: new SystemMessage(`
Bạn là Video Production Planning Expert chuyên phân tích kịch bản video và tạo kế hoạch sản xuất chi tiết.

NHIỆM VỤ:
Dựa trên Video Script Description được cung cấp, hãy tạo một Video Generation Plan chi tiết để có thể:
1. Generate hình ảnh/video cho từng cảnh bằng AI (Text-to-Image/Video)
2. Tạo timeline và sequence cho video
3. Xác định các yếu tố cần thiết (text overlay, music, transitions)

YÊU CẦU:

**SCENES:**
- Phân tích video script thành các cảnh cụ thể
- Mỗi cảnh cần có:
  + Mô tả visual rõ ràng bằng tiếng Việt
  + Image/video generation prompt bằng TIẾNG ANH (detailed, specific, cho Stable Diffusion/Midjourney)
  + Thời lượng phù hợp
  + Hiệu ứng chuyển cảnh

**IMAGE PROMPTS:**
- Viết prompts bằng TIẾNG ANH
- Chi tiết, cụ thể về:
  + Subject (đối tượng chính)
  + Setting (bối cảnh, môi trường)
  + Lighting (ánh sáng)
  + Style (phong cách: professional, cinematic, vibrant, etc.)
  + Camera angle (góc máy)
- Ví dụ: "A young Vietnamese office worker looking at clock, tired expression, holding oily food box, office desk background, natural lighting, realistic style, medium shot"

**TECHNICAL SPECS:**
- Aspect ratio phù hợp với platform (9:16 cho TikTok/Reels, 16:9 cho YouTube)
- Tổng thời lượng phù hợp với video script
- Text overlays cho brand name, key messages, CTA

**AUDIO & MUSIC:**
- Mô tả phong cách nhạc nền phù hợp
- Sync với audio script nếu có

OUTPUT:
- Một plan hoàn chỉnh, ready để implement
- Có thể dùng để generate video tự động hoặc hướng dẫn editor

Hãy tạo một video generation plan chi tiết, thực tế và khả thi!
  `),
  responseFormat: VideoGenerationPlanSchema,
});

// Export types
export type VideoGenerationPlan = z.infer<typeof VideoGenerationPlanSchema>;
export type VideoScene = z.infer<typeof VideoSceneSchema>;

