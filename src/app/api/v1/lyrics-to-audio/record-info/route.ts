import { SUNO_API_BASE_URL } from '@/constants/common'
import { ENV } from '@/constants/environments'
import { IResponse } from '@/types/response'
import { NextRequest, NextResponse } from 'next/server'

// [GET]: /lyrics-to-audio/record-info
export async function GET(req: NextRequest) {
  console.info('- Lyrics To Audio Status - ')

  try {
    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json<IResponse>(
        { message: 'Task ID is required', isSuccess: false },
        { status: 400 }
      )
    }

    // Call Suno API to get audio generation status
    const response = await fetch(
      `${SUNO_API_BASE_URL}/generate/record-info?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ENV.SUNO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Suno API error:', errorText)
      return NextResponse.json<IResponse>(
        {
          message: 'Failed to get audio generation status',
          isSuccess: false,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.info('--------------------------------')
    console.info(JSON.stringify(data, null, 2))

    return NextResponse.json<IResponse<unknown>>(
      {
        message: 'Get Status Success',
        isSuccess: true,
        data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Lyrics to Audio Status error:', error)
    return NextResponse.json<IResponse>(
      {
        message: 'Get Status Failed',
        isSuccess: false,
      },
      { status: 500 }
    )
  }
}
