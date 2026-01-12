import { handleToolErrors } from "@/middlewares/handleToolErrors";
import { searchTool } from "@/tools/searchTool";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, SystemMessage } from "langchain";
import { z } from "zod";
 
const model = new ChatOpenAI({
  model: "gpt-5.1",
  temperature: 0.1,
  maxTokens: 1000,
  timeout: 90000, // 90 seconds in milliseconds
  apiKey: process.env.OPENAI_API_KEY,
});


// Single research result schema
const ResearchItemSchema = z.object({
  url: z.string().describe("URL của kết quả tìm kiếm"),
  title: z.string().describe("Tiêu đề của kết quả tìm kiếm"),
  content: z.string().describe("Nội dung của kết quả tìm kiếm"),
  score: z.number().describe("Điểm số của kết quả tìm kiếm (0-1)"),
  published_date: z.string().describe("Ngày xuất bản của kết quả tìm kiếm"),
});

// Wrapper schema that contains array of results
const ResearchResultSchema = z.object({
  results: z.array(ResearchItemSchema).describe("Danh sách các kết quả tìm kiếm"),
});


export const researchAgent = createAgent({
  model,
  tools: [searchTool],
  middleware: [handleToolErrors], 
  systemPrompt: new SystemMessage({
    content: [{
      type: 'text',
      text: `You are a professional market research expert. Your task is to search for and compile accurate business information.

When given a query:
1. Use the industry_search tool to find relevant information
2. Extract key facts about companies, industries, or markets from the search results
3. Synthesize information into clear, concise summaries
4. Focus on credible, recent information
5. Present findings in a clear, organized manner

The search tool will return results with: url, title, content (truncated), score, published_date.

Return a response with:
- results: array of findings, each containing:
  - url: the source URL
  - title: clear, descriptive title
  - content: concise summary of key information (focus on business insights)
  - score: relevance score from search
  - published_date: when it was published
- totalResults: count of results found
- summary: overall synthesis highlighting the most important findings

Keep content concise and actionable. Focus on business value and insights.`
    }]
  }),
  responseFormat: ResearchResultSchema,
});

