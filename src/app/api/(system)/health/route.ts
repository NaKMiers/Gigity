import { NextResponse } from 'next/server'

export async function POST() {
  console.info('- Health -')
  NextResponse.json({ message: '✅ Good' }, { status: 200 })
}
