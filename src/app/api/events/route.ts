import { NextResponse } from 'next/server'
import { eventInputSchema } from '@/lib/validators/event'
import { createEvent, getAllEvents } from '@/lib/services/event.service'

export async function GET() {
  const events = await getAllEvents()
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = eventInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid event data' },
      { status: 400 }
    )
  }

  const event = await createEvent(parsed.data)
  return NextResponse.json(event, { status: 201 })
}
