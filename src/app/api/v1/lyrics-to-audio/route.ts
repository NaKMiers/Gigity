import { SUNO_API_BASE_URL } from '@/constants/common'
import { ENV } from '@/constants/environments'
import { IResponse } from '@/types/response'
import { NextRequest, NextResponse } from 'next/server'

// [POST]: /lyrics-to-audio
export async function POST(req: NextRequest) {
  console.info('- Lyrics To Audio - ')

  try {
    // Get input data
    const { lyrics, title, style, model } = await req.json()

    // Validate lyrics
    if (!lyrics) {
      return NextResponse.json<IResponse>(
        { message: 'Lyrics is required', isSuccess: false },
        { status: 400 }
      )
    }

    // Call Suno API to generate music
    const response = await fetch(`${SUNO_API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ENV.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: true,
        instrumental: false,
        model: model || 'V4',
        prompt: lyrics,
        title: title,
        style: style,
        callBackUrl: `${ENV.NEXT_PUBLIC_APP_URL}${ENV.NEXT_PUBLIC_API_PREFIX}/lyrics-to-audio/callback`,

        // Optional fields
        // personaId: 'persona_123',
        // negativeTags: 'Heavy Metal, Upbeat Drums',
        // vocalGender: 'm',
        // styleWeight: 0.65,
        // weirdnessConstraint: 0.65,
        // audioWeight: 0.65
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Suno API error:', errorText)
      return NextResponse.json<IResponse>(
        {
          message: 'Failed to generate audio from lyrics',
          isSuccess: false,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.info('--------------------------------')
    console.info(JSON.stringify(data, null, 2))

    // Return response
    return NextResponse.json<
      IResponse<{ lyrics: string; taskId: string; sunoResponse: unknown }>
    >(
      {
        message: 'Lyrics to Audio Success',
        isSuccess: true,
        data: {
          lyrics,
          taskId: data.taskId,
          sunoResponse: data,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Lyrics to Audio error:', error)
    return NextResponse.json<IResponse>(
      {
        message: 'Lyrics to Audio Failed',
        isSuccess: false,
      },
      { status: 500 }
    )
  }
}
