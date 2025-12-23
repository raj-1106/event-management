import { NextResponse } from 'next/server'
import { createEvent } from '@/lib/services/event.service'

export async function GET() {
  const event = await createEvent({
    title: 'Test Event',
    description: 'This is a test event',
    location: 'Online',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  })

  return NextResponse.json(event)
}
