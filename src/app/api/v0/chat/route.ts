
  



// // Configure the route to allow longer execution time
// export const maxDuration = 180; // 180 seconds for full flow with marketing agent
// export const dynamic = 'force-dynamic';

// // Helper function to add timeout to any promise
// function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
//   return Promise.race([
//     promise,
//     new Promise<T>((_, reject) =>
//       setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs/1000}s`)), timeoutMs)
//     ),
//   ]);
// }

// export async function POST(req: Request) {
//   try {
//     const { messages }: { messages: UIMessage[] } = await req.json();
    
//     // Get the last user message
//     const lastMessage = messages[messages.length - 1];
    
//     // Extract text from message parts
//     const userQuery = lastMessage.parts
//       .filter((part: any) => part.type === 'text')
//       .map((part: any) => part.text)
//       .join(' ');
    
//     console.log('User query:', userQuery);
//     console.log('Starting analysis...');

//     const result = await marketingAgent.invoke({
//       messages: [
//         new HumanMessage(`
//     Thông tin doanh nghiệp:
//     ${userQuery}
    
//     Hãy tạo kịch bản marketing video ngắn dựa trên thông tin trên.
//     `)
//       ],
//     });
    
//     const script = result.structuredResponse;
//     return new Response(JSON.stringify({
//       messages: [script]
//     }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
    
    
    
// //     // Step 1: Analyze the user input with analyzeAgent (with 60s timeout)
// //     const analysisResult = await withTimeout(
// //       analyzeAgent.invoke({
// //         messages: [new HumanMessage(userQuery)]
// //       }),
// //       60000,
// //       'Analysis'
// //     );
    
// //     console.log('Analysis completed:', JSON.stringify(analysisResult.structuredResponse, null, 2));
    
// //     // Step 2: Use the optimized prompt for research
// //     const optimizedPrompt = analysisResult.structuredResponse.optimizedPrompt;
    
// //     console.log('Starting research with prompt:', optimizedPrompt);
    
// //     // Step 3: Invoke the research agent with the optimized prompt (with 120s timeout)
// //     const researchResult = await withTimeout(
// //       researchAgent.invoke({
// //         messages: [new HumanMessage(optimizedPrompt)]
// //       }),
// //       50000,
// //       'Research'
// //     );
    
// //     console.log('Research completed');
    
// //     // Get analysis and research data
// //     const analysis = analysisResult.structuredResponse;
// //     const research = researchResult.structuredResponse;

    
// //     // Step 4: Generate marketing scenarios with marketingAgent (with 90s timeout)
// //     console.log('Starting marketing scenario generation...');
    
// //     // Prepare context for marketing agent
// //     const marketingContext = `
// // COMPANY INFORMATION:
// // ${analysis.entities.companyName ? `Company: ${analysis.entities.companyName}` : 'Company not specified'}
// // ${analysis.entities.industry ? `Industry: ${analysis.entities.industry}` : ''}
// // ${analysis.entities.location ? `Location: ${analysis.entities.location}` : ''}

// // RESEARCH FINDINGS:
// // ${research.results.slice(0,1).map((item: any, idx: number) => `
// // ${idx + 1}. ${item.title}
// // ${item.content}
// // Source: ${item.url}
// // `).join('\n')}

// // USER INTENT: ${analysis.intent}
// // KEYWORDS: ${analysis.entities.keywords.join(', ')}

// // Based on the above research, create detailed marketing scenarios for this business.
// // `;
// //     console.log(marketingContext);
// //     const marketingResult = await withTimeout(
// //       marketingAgent.invoke({
// //         messages: [new HumanMessage(marketingContext)]
// //       }),
// //       90000,
// //       'Marketing Scenario Generation'
// //     );
    
// //     console.log('Marketing scenario generation completed');
    
// //     // Step 5: Format the comprehensive response
// //     const marketing = marketingResult.structuredResponse;
    
// //     // Create a formatted text response with all information
// //     const responseText = `🔍 **PHÂN TÍCH**
// // Intent: ${analysis.intent}
// // ${analysis.entities.companyName ? `Công ty: ${analysis.entities.companyName}` : ''}
// // ${analysis.entities.industry ? `Ngành: ${analysis.entities.industry}` : ''}
// // ${analysis.entities.location ? `Khu vực: ${analysis.entities.location}` : ''}
// // ${analysis.entities.keywords.length > 0 ? `Keywords: ${analysis.entities.keywords.join(', ')}` : ''}

// // 📊 **NGHIÊN CỨU THỊ TRƯỜNG** (${research.results.length || 0} kết quả)

// // ${research.results && Array.isArray(research.results) ? research.results.map((item: any, idx: number) => `
// // ${idx + 1}. **${item.title}**
// //    ${item.content}
// //    🔗 ${item.url}`).join('\n\n') : 'Không tìm thấy kết quả'}

// // ---

// // 🎯 **KỊCH BẢN MARKETING**

// // **📋 Bối cảnh công ty:**


// // **💡 Insights thị trường:**
// // ${marketing.marketInsights}

// // **🎨 Chiến lược tổng thể:**


// // **💰 Đề xuất ngân sách:**


// // ---

// // ${marketing.campaign.campaignName}
// // ${marketing.campaign.objective}
// // ${marketing.campaign.targetAudience.demographic}
// // ${marketing.campaign.targetAudience.psychographic}
// // ${marketing.campaign.targetAudience.painPoints.map((p: string) => `  • ${p}`).join('\n')}
// // ${marketing.campaign.keyMessages.map((msg: string) => `• ${msg}`).join('\n')}
// // **Timeline:**
// // • Chuẩn bị: ${marketing.campaign.timeline.preparation}
// // • Ra mắt: ${marketing.campaign.timeline.launch}
// // • Thời lượng: ${marketing.campaign.timeline.duration}

// // **KPIs:**
// // ${marketing.campaign.kpis.map((kpi: any) => `• ${kpi.metric}: ${kpi.target}`).join('\n')}

// // **Lợi thế cạnh tranh:**
// // ${marketing.campaign.competitiveAdvantage}

// // **Rủi ro & giảm thiểu:**
// // ${marketing.campaign.risks.map((risk: string) => `• ${risk}`).join('\n')}
// // `.trim();
    
// //     // Return in the format expected by useChat
// //     const responseMessage = {
// //       id: nanoid(),
// //       role: 'assistant',
// //       parts: [
// //         {
// //           type: 'text',
// //           text: responseText
// //         }
// //       ]
// //     };
    
// //     return new Response(JSON.stringify({
// //       messages: [responseMessage]
// //     }), {
// //       status: 200,
// //       headers: {
// //         'Content-Type': 'application/json',
// //       }
// //     });
//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({
//       error: 'Internal server error'
//     }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//   }
// }


/*
GreenBite là một startup F&B tại Việt Nam chuyên về đồ ăn nhanh lành mạnh (healthy fast food) dành cho người trẻ sống ở thành phố. Công ty tập trung vào các món như salad, bowl, wrap, sinh tố và nước ép cold-pressed, với nguyên liệu 100% organic, ít đường, ít dầu mỡ.

Khách hàng mục tiêu của GreenBite là nhân viên văn phòng, người tập gym, và người quan tâm đến sức khỏe nhưng không có nhiều thời gian nấu ăn. Điểm khác biệt của GreenBite so với các quán ăn thông thường là:

Thực đơn được thiết kế bởi chuyên gia dinh dưỡng

Có thể cá nhân hóa món ăn theo mục tiêu: giảm cân, giữ dáng, tăng cơ

Đặt hàng nhanh qua app và giao trong 20–30 phút

Thông điệp thương hiệu của GreenBite là:

“Ăn nhanh – Sống khỏe – Không phải hy sinh hương vị.”

Mục tiêu của doanh nghiệp là trở thành thương hiệu healthy food hàng đầu cho giới trẻ đô thị trong 3 năm tới, bắt đầu từ TP.HCM và Hà Nội.
*/