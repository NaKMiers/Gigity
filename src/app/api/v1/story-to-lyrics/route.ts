import { STORY_TO_LYRICS_SYSTEM_PROMPT } from '@/constants/system-prompts'
import { StoryToLyricsRequestSchema } from '@/types/input-data'
import { StoryToLyricsData } from '@/types/output-schemas'
import { IResponse } from '@/types/response'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /story-to-lyrics
export async function POST(req: NextRequest) {
  console.info('- Story To Lyrics - ')

  try {
    // Validate request body
    const body = await req.json()
    const validation = StoryToLyricsRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<IResponse>(
        {
          message: 'Invalid request data: ' + validation.error.message,
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const { story } = validation.data

    // Generate lyrics
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: STORY_TO_LYRICS_SYSTEM_PROMPT,
      prompt: story,
      abortSignal: req.signal,
    })

    // Return response
    return NextResponse.json<IResponse<StoryToLyricsData>>({
      message: 'Story to Lyrics Success',
      isSuccess: true,
      data: { story, lyrics: text },
    })
  } catch (error) {
    console.error('Story to Lyrics error:', error)
    return NextResponse.json<IResponse>(
      {
        message: 'Story to Lyrics Failed',
        isSuccess: false,
      },
      { status: 500 }
    )
  }
}
