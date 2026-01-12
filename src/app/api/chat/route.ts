import { analyzeAgent } from '@/agents/analyzeAgent';
import { marketingAgent } from '@/agents/marketingAgent';
import { researchAgent } from '@/agents/researchAgent';
import { UIMessage } from 'ai';
import { HumanMessage } from 'langchain';
import { nanoid } from 'nanoid';

// Configure the route to allow longer execution time
export const maxDuration = 180; // 180 seconds for full flow with marketing agent
export const dynamic = 'force-dynamic';

// Helper function to add timeout to any promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs/1000}s`)), timeoutMs)
    ),
  ]);
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    
    // Extract text from message parts
    const userQuery = lastMessage.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');
    
    console.log('User query:', userQuery);
    console.log('Starting analysis...');
    
    // Step 1: Analyze the user input with analyzeAgent (with 60s timeout)
    const analysisResult = await withTimeout(
      analyzeAgent.invoke({
        messages: [new HumanMessage(userQuery)]
      }),
      60000,
      'Analysis'
    );
    
    console.log('Analysis completed:', JSON.stringify(analysisResult.structuredResponse, null, 2));
    
    // Step 2: Use the optimized prompt for research
    const optimizedPrompt = analysisResult.structuredResponse.optimizedPrompt;
    
    console.log('Starting research with prompt:', optimizedPrompt);
    
    // Step 3: Invoke the research agent with the optimized prompt (with 120s timeout)
    const researchResult = await withTimeout(
      researchAgent.invoke({
        messages: [new HumanMessage(optimizedPrompt)]
      }),
      120000,
      'Research'
    );
    
    console.log('Research completed');
    
    // Get analysis and research data
    const analysis = analysisResult.structuredResponse;
    const research = researchResult.structuredResponse;
    
    // Step 4: Generate marketing scenarios with marketingAgent (with 60s timeout)
    console.log('Starting marketing scenario generation...');
    
    // Prepare context for marketing agent
    const marketingContext = `
COMPANY INFORMATION:
${analysis.entities.companyName ? `Company: ${analysis.entities.companyName}` : 'Company not specified'}
${analysis.entities.industry ? `Industry: ${analysis.entities.industry}` : ''}
${analysis.entities.location ? `Location: ${analysis.entities.location}` : ''}

RESEARCH FINDINGS:
${research.results.map((item: any, idx: number) => `
${idx + 1}. ${item.title}
${item.content}
Source: ${item.url}
`).join('\n')}

USER INTENT: ${analysis.intent}
KEYWORDS: ${analysis.entities.keywords.join(', ')}

Based on the above research, create detailed marketing scenarios for this business.
`;

    const marketingResult = await withTimeout(
      marketingAgent.invoke({
        messages: [new HumanMessage(marketingContext)]
      }),
      60000,
      'Marketing Scenario Generation'
    );
    
    console.log('Marketing scenario generation completed');
    
    // Step 5: Format the comprehensive response
    const marketing = marketingResult.structuredResponse;
    
    // Create a formatted text response with all information
    const responseText = `🔍 **PHÂN TÍCH**
Intent: ${analysis.intent}
${analysis.entities.companyName ? `Công ty: ${analysis.entities.companyName}` : ''}
${analysis.entities.industry ? `Ngành: ${analysis.entities.industry}` : ''}
${analysis.entities.location ? `Khu vực: ${analysis.entities.location}` : ''}
${analysis.entities.keywords.length > 0 ? `Keywords: ${analysis.entities.keywords.join(', ')}` : ''}

📊 **NGHIÊN CỨU THỊ TRƯỜNG** (${research.results.length || 0} kết quả)

${research.results && Array.isArray(research.results) ? research.results.map((item: any, idx: number) => `
${idx + 1}. **${item.title}**
   ${item.content}
   🔗 ${item.url}`).join('\n\n') : 'Không tìm thấy kết quả'}

---

🎯 **KỊCH BẢN MARKETING**

**📋 Bối cảnh công ty:**
${marketing.companyContext}

**💡 Insights thị trường:**
${marketing.marketInsights}

**🎨 Chiến lược tổng thể:**
${marketing.overallStrategy}

**💰 Đề xuất ngân sách:**
${marketing.budgetRecommendation}

---

${marketing.campaigns.map((campaign: any, idx: number) => `
## 🚀 CHIẾN DỊCH ${idx + 1}: ${campaign.campaignName}

**Mục tiêu:** ${campaign.objective}

**Đối tượng mục tiêu:**
- Demographic: ${campaign.targetAudience.demographic}
- Psychographic: ${campaign.targetAudience.psychographic}
- Pain Points:
${campaign.targetAudience.painPoints.map((p: string) => `  • ${p}`).join('\n')}

**Key Messages:**
${campaign.keyMessages.map((msg: string) => `• ${msg}`).join('\n')}

**Kênh Marketing:**
${campaign.channels.map((ch: any) => `
📱 **${ch.name}**
   Chiến lược: ${ch.strategy}
   Ngân sách: ${ch.budget}`).join('\n')}

**Ý tưởng nội dung:**
${campaign.contentIdeas.map((content: any, i: number) => `
${i + 1}. **[${content.type}] ${content.title}**
   ${content.description}
   CTA: "${content.cta}"`).join('\n')}

**Timeline:**
• Chuẩn bị: ${campaign.timeline.preparation}
• Ra mắt: ${campaign.timeline.launch}
• Thời lượng: ${campaign.timeline.duration}

**KPIs:**
${campaign.kpis.map((kpi: any) => `• ${kpi.metric}: ${kpi.target}`).join('\n')}

**Lợi thế cạnh tranh:**
${campaign.competitiveAdvantage}

**Rủi ro & giảm thiểu:**
${campaign.risks.map((risk: string) => `• ${risk}`).join('\n')}
`).join('\n\n---\n')}`.trim();
    
    // Return in the format expected by useChat
    const responseMessage = {
      id: nanoid(),
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: responseText
        }
      ]
    };
    
    return new Response(JSON.stringify({
      messages: [responseMessage]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Determine error message based on error type
    let errorText = '❌ An error occurred while processing your request.';
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorText = `⏱️ Request timed out. The search is taking longer than expected. Please try:\n\n` +
                   `1. A more specific query\n` +
                   `2. Asking about a well-known company\n` +
                   `3. Trying again in a moment\n\n` +
                   `Error: ${error.message}`;
      } else if (error.message.includes('OPENAI_API_KEY') || error.message.includes('TAVILY_API_KEY')) {
        errorText = `🔑 API Key Error: Please ensure your API keys are properly configured in the environment variables.\n\n` +
                   `Required keys:\n` +
                   `- OPENAI_API_KEY\n` +
                   `- TAVILY_API_KEY`;
      } else {
        errorText = `❌ Error: ${error.message}\n\nPlease try again or rephrase your query.`;
      }
    }
    
    // Return error in the same format
    const errorMessage = {
      id: nanoid(),
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: errorText
        }
      ]
    };
    
    return new Response(JSON.stringify({
      messages: [errorMessage]
    }), {
      status: 200, // Still return 200 so the UI can display the error message
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}