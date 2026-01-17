  import { ChatOpenAI } from "@langchain/openai";
import { createAgent, SystemMessage } from "langchain";
import { z } from "zod";

  const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0.7, // Higher temperature for creative marketing content
    maxTokens: 6000, // More tokens for detailed marketing scenarios
    timeout: 60000,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Schema for marketing campaign structure
  const MarketingCampaignSchema = z.object({
    campaignName: z.string().describe("Tên chiến dịch marketing"),
    objective: z.string().describe("Mục tiêu chính của chiến dịch"),
    targetAudience: z.object({
      demographic: z.string().describe("Nhân khẩu học (tuổi, giới tính, thu nhập)"),
      psychographic: z.string().describe("Tâm lý (sở thích, hành vi, giá trị)"),
      painPoints: z.array(z.string()).describe("Các vấn đề khách hàng đang gặp phải"),
    }),
    keyMessages: z.array(z.string()).describe("Các thông điệp chính cần truyền tải"),
    channels: z.array(z.object({
      name: z.string().describe("Tên kênh (Facebook, TikTok, Google Ads, etc.)"),
      strategy: z.string().describe("Chiến lược cho kênh này"),
      budget: z.string().describe("Phân bổ ngân sách đề xuất"),
    })).describe("Các kênh marketing và chiến lược"),
    contentIdeas: z.array(z.object({
      type: z.string().describe("Loại nội dung (video, blog, infographic, etc.)"),
      title: z.string().describe("Tiêu đề nội dung"),
      description: z.string().describe("Mô tả chi tiết nội dung"),
      cta: z.string().describe("Call-to-action (hành động kêu gọi)"),
    })).describe("Các ý tưởng nội dung cụ thể"),
    timeline: z.object({
      preparation: z.string().describe("Thời gian chuẩn bị"),
      launch: z.string().describe("Thời điểm khởi chạy đề xuất"),
      duration: z.string().describe("Thời lượng chiến dịch"),
    }),
    kpis: z.array(z.object({
      metric: z.string().describe("Chỉ số đo lường"),
      target: z.string().describe("Mục tiêu cụ thể"),
    })).describe("Các chỉ số đo lường hiệu quả (KPIs)"),
    competitiveAdvantage: z.string().describe("Lợi thế cạnh tranh so với đối thủ"),
    risks: z.array(z.string()).describe("Các rủi ro tiềm ẩn và cách giảm thiểu"),
  });
  

//   const MarketingScenarioSchema = z.object({
//     // companyContext: z.string().describe("Bối cảnh về công ty dựa trên research"),
//     marketInsights: z.string().describe("Insights về thị trường từ research"),
//     campaign: MarketingCampaignSchema.describe("Danh sách các kịch bản chiến dịch (2-3 chiến dịch)"),
//     // overallStrategy: z.string().describe("Chiến lược marketing tổng thể"),
//     // budgetRecommendation: z.string().describe("Đề xuất phân bổ ngân sách tổng thể"),
//   });

//   export const marketingAgent = createAgent({
//     model,
//     tools: [], // No tools needed, this agent processes information
//     systemPrompt: new SystemMessage(`Bạn là chuyên gia Marketing Strategy với hơn 15 năm kinh nghiệm trong việc tạo và triển khai các chiến dịch marketing thành công cho doanh nghiệp Việt Nam.

//   NHIỆM VỤ:
//   Dựa trên kết quả nghiên cứu thị trường được cung cấp, hãy tạo một kịch bản marketing chi tiết và khả thi cho doanh nghiệp.

//   QUY TRÌNH:
//   1. Phân tích thông tin công ty và thị trường từ research data
//   2. Xác định insights quan trọng về đối thủ, xu hướng, và cơ hội
//   3. Thiết kế 2-3 chiến dịch marketing cụ thể với các yếu tố:
//     - Mục tiêu rõ ràng, có thể đo lường
//     - Đối tượng mục tiêu chi tiết (demographic + psychographic)
//     - Key messages phù hợp với văn hóa Việt Nam
//     - Kênh marketing phù hợp (digital + traditional nếu cần)
//     - Nội dung sáng tạo, hấp dẫn
//     - Timeline thực tế
//     - KPIs cụ thể

//   NGUYÊN TẮC:
//   ✅ Thực tế và khả thi cho thị trường Việt Nam
//   ✅ Sáng tạo nhưng dựa trên data và insights
//   ✅ Tập trung vào ROI và hiệu quả đo lường
//   ✅ Cân đối giữa online và offline (nếu phù hợp)
//   ✅ Tận dụng xu hướng hiện tại (TikTok, Livestream, KOL/KOC, etc.)
//   ✅ Ngôn ngữ marketing gần gũi, dễ hiểu cho người Việt

//   ❌ Tránh chiến lược chung chung, không cụ thể
//   ❌ Tránh đề xuất không phù hợp với ngân sách SME Việt Nam
//   ❌ Tránh bỏ qua văn hóa và insight địa phương

//   OUTPUT FORMAT:
//   - companyContext: Tóm tắt về công ty từ research
//   - marketInsights: Insights quan trọng về thị trường/đối thủ
//   - campaigns: 2-3 chiến dịch chi tiết
//   - overallStrategy: Chiến lược tổng thể
//   - budgetRecommendation: Phân bổ ngân sách hợp lý

//   Hãy tạo ra các chiến dịch marketing có tính thực thi cao, sáng tạo và phù hợp với bối cảnh Việt Nam!`),
//     responseFormat: MarketingScenarioSchema,
//   });

//   // Export types
//   export type MarketingScenario = z.infer<typeof MarketingScenarioSchema>;
//   export type MarketingCampaign = z.infer<typeof MarketingCampaignSchema>;


const MarketingShortScriptSchema = z.object({
  audio_script_description: z
    .string()
    .describe(
      "Kịch bản lời thoại audio cho video ngắn (15–30s), giọng marketing, truyền cảm hứng, dễ đọc cho TTS"
    ),
  video_script_description: z
    .string()
    .describe(
      "Mô tả kịch bản hình ảnh cho video ngắn (15–30s), theo từng cảnh, tập trung vào hình ảnh, cảm xúc, hành động"
    ),
});


export const marketingAgent = createAgent({
  model,
  tools: [],
  systemPrompt: new SystemMessage(`
Bạn là Creative Marketing Script Writer chuyên tạo kịch bản video ngắn (short video) để quảng bá doanh nghiệp Việt Nam trên TikTok, Facebook Reels, YouTube Shorts.

NHIỆM VỤ:
Dựa trên thông tin doanh nghiệp do người dùng cung cấp, hãy tạo MỘT kịch bản marketing ngắn có thể dùng để:
- Sinh video ngắn (15–30 giây)
- Sinh audio / voice-over (TTS)

YÊU CẦU CHUNG:
- Nội dung ngắn gọn, súc tích, dễ hiểu
- Ngôn ngữ marketing gần gũi, phù hợp người Việt
- Tập trung vào GIÁ TRỊ CỐT LÕI và LỢI ÍCH cho khách hàng
- Không nói chung chung, tránh sáo rỗng
- Không nhắc tới "chiến dịch", "KPI", "ngân sách"

AUDIO SCRIPT:
- Viết như lời thoại đọc lên
- Có nhịp điệu, cảm xúc
- Có CTA nhẹ ở cuối (ví dụ: "Khám phá ngay", "Trải nghiệm hôm nay")

VIDEO SCRIPT:
- Mô tả bằng hình ảnh, không phải lời thoại
- Chia theo các cảnh (Scene 1, Scene 2, ...)
- Tập trung vào:
  + Hình ảnh thương hiệu
  + Sản phẩm / dịch vụ
  + Cảm xúc khách hàng
  + Kết thúc ấn tượng

ĐỘ DÀI:
- Phù hợp video 15–30 giây
- Không quá dài, không lan man

OUTPUT FORMAT (BẮT BUỘC JSON):
{
  "audio_script_description": "...",
  "video_script_description": "..."
}

CHỈ TRẢ VỀ JSON, KHÔNG GIẢI THÍCH THÊM.
  `),
  responseFormat: MarketingShortScriptSchema,
});
