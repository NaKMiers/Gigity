import { marketingAgent } from '@/agents/marketingAgent';
import { videoGenerationAgent } from '@/agents/videoGenerationAgent';
import { UIMessage } from 'ai';
import { HumanMessage } from 'langchain';
import { nanoid } from 'nanoid';

// Configure the route to allow longer execution time
export const maxDuration = 180; // 180 seconds for full flow
export const dynamic = 'force-dynamic';

// Helper function to add timeout
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
    
    // Step 1: Generate marketing script (audio + video)
    console.log('Step 1: Generating marketing script...');
    const scriptResult = await withTimeout(
      marketingAgent.invoke({
        messages: [
          new HumanMessage(`
Thông tin doanh nghiệp:
${userQuery}

Hãy tạo kịch bản marketing video ngắn dựa trên thông tin trên.
`)
        ],
      }),
      60000,
      'Marketing Script Generation'
    );
    
    const script = scriptResult.structuredResponse;
    console.log('✅ Marketing script generated', script);
    
    // Step 2: Generate video production plan from video script
    console.log('Step 2: Generating video production plan...');
    const videoPlanResult = await withTimeout(
      videoGenerationAgent.invoke({
        messages: [
          new HumanMessage(`
Video Script Description:
${script.video_script_description}

Audio Script:
${script.audio_script_description}

Hãy tạo một video generation plan chi tiết từ video script trên.
`)
        ],
      }),
      60000,
      'Video Generation Planning'
    );
    
    const videoPlan = videoPlanResult.structuredResponse;
    console.log('✅ Video production plan generated');
    
    // Step 3: Format comprehensive response
    const formattedResponse = `# 🎬 KỊCH BẢN VIDEO MARKETING

## 🎙️ AUDIO SCRIPT (Lời thoại)
${script.audio_script_description}

---

## 📹 VIDEO SCRIPT (Kịch bản hình ảnh)
${script.video_script_description}

---

## 🎥 VIDEO PRODUCTION PLAN

**⏱️ Tổng thời lượng:** ${videoPlan.totalDuration}
**📐 Aspect Ratio:** ${videoPlan.aspectRatio}
**🎵 Phong cách nhạc:** ${videoPlan.musicStyle}

### 🎬 SCENES (${videoPlan.scenes.length} cảnh)

${videoPlan.scenes.map((scene: any) => `
**Scene ${scene.sceneNumber}** (${scene.duration})
📝 Mô tả: ${scene.visualDescription}
🎨 Image Prompt: "${scene.imagePrompt}"
${scene.transitionEffect ? `↔️  Transition: ${scene.transitionEffect}` : ''}
`).join('\n')}

### 📝 TEXT OVERLAYS

${videoPlan.textOverlays.map((overlay: any) => `
- **Scene ${overlay.sceneNumber}:** "${overlay.text}" (${overlay.style})
`).join('\n')}

### 📢 CALL TO ACTION
**Text:** ${videoPlan.callToAction.text}
**Vị trí:** ${videoPlan.callToAction.position}

### 🎵 AUDIO DESCRIPTION
${videoPlan.audioDescription}

---

## 💡 NEXT STEPS

1. **Generate Images/Videos:** Sử dụng các image prompts ở trên với:
   - Stable Diffusion / Midjourney
   - Leonardo AI
   - DALL-E 3

2. **Video Editing:** Sử dụng:
   - CapCut / Adobe Premiere
   - Remotion (code-based)
   - Descript (AI-based)

3. **Add Audio:** 
   - Text-to-Speech: ElevenLabs, Google TTS
   - Nhạc nền: Epidemic Sound, Artlist

4. **Final Export:** ${videoPlan.aspectRatio} cho TikTok/Reels/YouTube Shorts
`.trim();
    
    const responseMessage = {
      id: nanoid(),
      role: 'assistant',
      parts: [
        {
          type: 'text',
          text: formattedResponse
        }
      ]
    };
    
    return new Response(JSON.stringify({
      messages: [responseMessage],
      metadata: {
        script: script,
        videoPlan: videoPlan,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
}