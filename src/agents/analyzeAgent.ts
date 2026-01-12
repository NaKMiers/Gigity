import { ChatOpenAI } from "@langchain/openai";
import { createAgent, SystemMessage } from "langchain";
import { z } from "zod";

const model = new ChatOpenAI({
  model: "gpt-5.1",
  temperature: 0.2,
  maxTokens: 500,
  timeout: 60000, // 60 seconds in milliseconds
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for the analysis result
const AnalysisResultSchema = z.object({
  intent: z.enum([
    "company_search",
    "industry_analysis",
    "market_research",
    "competitor_analysis",
    "customer_insights",
    "general_query"
  ]).describe("The main intent of the user query"),
  
  entities: z.object({  
    companyName: z.string().describe("Company name if mentioned, or empty string if not"),
    industry: z.string().describe("Industry or sector, or empty string if not identified"),
    location: z.string().describe("Geographic location, or empty string if not mentioned"),
    keywords: z.array(z.string()).describe("Key search terms extracted from the query")
  }),
  
  optimizedPrompt: z.string().describe("Optimized search prompt for the research agent"),
  
  searchParameters: z.object({
    query: z.string().describe("Main search query"),
    industry: z.string().describe("Industry filter, or empty string if not applicable"),
    language: z.string().describe("Search language, default is 'vi' for Vietnamese")
  })
});

export const analyzeAgent = createAgent({
  model,
  tools: [],
  systemPrompt: new SystemMessage({
    content: [{
      type: 'text',
      text: `You are an expert at analyzing user queries for business intelligence and market research.

Your task is to:
1. Understand the user's intent (what they want to find)
2. Extract key entities (company names, industries, locations, keywords)
3. Generate an optimized search prompt in Vietnamese for finding relevant information
4. Structure search parameters for the research agent

Guidelines:
- If user asks about a company, extract the full company name
- Identify the industry/sector if mentioned or can be inferred
- Extract location information (city, region, country)
- Create clear, specific search queries in Vietnamese
- Focus on actionable business information

Example:
Input: "Tìm thông tin về Công ty cổ phần Vinamilk"
Output: {
  intent: "company_search",
  entities: {
    companyName: "Công ty cổ phần Vinamilk",
    industry: "Food & Beverage",
    location: "Vietnam",
    keywords: ["Vinamilk", "sữa", "thực phẩm"]
  },
  optimizedPrompt: "Tìm thông tin chi tiết về Công ty cổ phần Vinamilk: lịch sử hình thành, sản phẩm chính, thị phần, chiến lược kinh doanh, và vị thế trên thị trường",
  searchParameters: {
    query: "Công ty cổ phần Vinamilk thông tin doanh nghiệp",
    industry: "Food & Beverage",
    language: "vi"
  }
}

Important: Use empty string "" for fields that are not applicable or cannot be determined. All fields must be provided.`
    }]
  }),
  responseFormat: AnalysisResultSchema,
});

// Export the schema type for use in other files
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

