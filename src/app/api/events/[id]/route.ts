import { NextResponse } from 'next/server'
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from '@/lib/services/event.service'
import { eventInputSchema } from '@/lib/validators/event'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const event = await getEventById(id)

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const body = await req.json()
  const parsed = eventInputSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const event = await updateEvent(id, parsed.data)
  return NextResponse.json(event)
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  await deleteEvent(id)
  return NextResponse.json({ success: true })
}
