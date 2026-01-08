import { ENV } from '@/constants/environments'
import { NextResponse } from 'next/server'

export async function GET() {
  console.info('- Version -')
  return NextResponse.json(
    { serverVersion: ENV.NEXT_PUBLIC_VERSION },
    { status: 200 }
  )
}
