import { LYRICS_TO_SCENE_PROMPTS_SYSTEM_PROMPT } from '@/constants/system-prompts'
import { LyricsToScenePromptsRequestSchema } from '@/types/input-data'
import {
  LyricsToScenePromptsData,
  LyricsToScenePromptsDataOutput,
} from '@/types/output-schemas'
import { IResponse } from '@/types/response'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /lyrics-to-scene-prompts
export async function POST(req: NextRequest) {
  console.info('- Lyrics To Scene Prompts - ')

  try {
    // Validate request body
    const body = await req.json()
    const validation = LyricsToScenePromptsRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<IResponse>(
        {
          message: 'Invalid request data: ' + validation.error.message,
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const { story, lyrics } = validation.data

    // Generate scene prompts with structured output
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: LYRICS_TO_SCENE_PROMPTS_SYSTEM_PROMPT,
      prompt: `Story: ${story}\n\nLyrics: ${lyrics}`,
      output: LyricsToScenePromptsDataOutput,
      abortSignal: req.signal,
    })

    // Return response
    return NextResponse.json<IResponse<LyricsToScenePromptsData>>({
      message: 'Lyrics to Scene Prompts Success',
      isSuccess: true,
      data: result.output,
    })
  } catch (error) {
    console.error('Lyrics to Scene Prompts error:', error)
    return NextResponse.json<IResponse>(
      {
        message: 'Lyrics to Scene Prompts Failed',
        isSuccess: false,
      },
      { status: 500 }
    )
  }
}
