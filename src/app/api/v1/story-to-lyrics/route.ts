import { STORY_TO_LYRICS_SYSTEM_PROMPT } from '@/constants/system-prompts'
import { IResponse } from '@/types/response'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /story-to-lyrics
export async function POST(req: NextRequest) {
  console.info('- Story To Lyrics - ')

  try {
    // Get prompt
    const { prompt } = await req.json()

    // Validate prompt
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Generate lyrics
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: STORY_TO_LYRICS_SYSTEM_PROMPT,
      prompt: prompt,
      abortSignal: req.signal,
    })

    // Return response
    return NextResponse.json<IResponse<{ prompt: string; text: string }>>(
      {
        message: 'Story to Lyrics Success',
        isSuccess: true,
        data: { prompt, text },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json<IResponse>(
      { message: 'Story to Lyrics Failed', isSuccess: false },
      { status: 500 }
    )
  }
}
