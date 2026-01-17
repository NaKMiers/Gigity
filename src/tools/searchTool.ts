import { tavily } from '@tavily/core';
import { DynamicStructuredTool } from 'langchain';
import { z } from "zod";

export const searchTool = new DynamicStructuredTool({
  name: "industry_search",
  description: `
  Tìm thông tin về doanh nghiệp, ngành nghề, xu hướng marketing,
  insight khách hàng từ website và nguồn online.
  `,
  schema: z.object({
    query: z.string().describe("Từ khoá tìm kiếm"),
    industry: z.string().optional().describe("Ngành nghề liên quan").default(""),
    language: z.string().default("vi").describe("Ngôn ngữ kết quả"),
  }),
  func: async ({ query, industry, language }: {
    query: string;
    industry: string;
    language: string;
  }) => {
    try {
      const finalQuery = industry
        ? `${query} ngành ${industry}`
        : query;

      console.log('Starting Tavily search for:', finalQuery);

      const client = tavily({
        apiKey: process.env.TAVILY_API_KEY,
      });
      
      // Add timeout to the search
      const searchPromise = client.search(finalQuery, {
        searchDepth: 'advanced',
        country: 'vietnam',
        maxResults: 2, // Limit results to speed up
        language: language,
      });
      
      // Race against timeout (30 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout after 30 seconds')), 30000)
      );

      const results = await Promise.race([searchPromise, timeoutPromise]);
      
      console.log('Tavily search completed');

      // Safely extract results array, fallback to [] if shape unexpected
      const extractedResults =
        results && typeof results === 'object' && Array.isArray((results as any).results)
          ? (results as any).results
          : [];

      // Truncate content to reduce token usage and processing time
      const truncatedResults = extractedResults.map((result: any) => ({
        url: result.url || '',
        title: result.title || '',
        // Limit content to first 500 characters to avoid overwhelming the agent
        content: result.content ? result.content.substring(0, 500) + (result.content.length > 500 ? '...' : '') : '',
        score: result.score || 0,
        published_date: result.published_date || result.publishedDate || '',
      }));

      const finalResults = {
        results: truncatedResults,
      };
      
      console.log(`Returning ${truncatedResults.length} truncated results`);
      return finalResults;

    } catch (error) {
      console.error('Search tool error:', error);
      return JSON.stringify({
        error: 'Search failed',
        message: error instanceof Error ? error.message : String(error),
        results: []
      });
    }
  },
});

