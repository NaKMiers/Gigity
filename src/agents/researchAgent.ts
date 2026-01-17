import { handleToolErrors } from "@/middlewares/handleToolErrors";
import { searchTool } from "@/tools/searchTool";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, SystemMessage, toolStrategy } from "langchain";
import { z } from "zod";
 
let searchCount = 0;
const MAX_SEARCH = 1;

const limitedSearchTool = {
  ...searchTool,
  async invoke(input: any) {
    if (searchCount >= MAX_SEARCH) {
      throw new Error("Search tool usage limit reached (max 1)");
    }
    searchCount++;
    return searchTool.invoke(input);
  },
};


const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
  maxTokens: 600, //down from 1000 to 600 to save tokens
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
const ResearchResultSchema =toolStrategy( z.object({
  results: z.array(ResearchItemSchema).describe("Danh sách các kết quả tìm kiếm"),
}));


export const researchAgent = createAgent({
  model,
  tools: [limitedSearchTool],
  middleware: [handleToolErrors], 
  systemPrompt: new SystemMessage(`You are a professional market research expert. Your task is to search for and compile accurate business information.

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

Keep content concise and actionable. Focus on business value and insights.`),
  responseFormat: ResearchResultSchema,
});

