import { db } from '@/db'
import { events } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { EventInput } from '@/lib/validators/event'

export async function createEvent(data: EventInput) {
  const [event] = await db
    .insert(events)
    .values({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    })
    .returning()

  return event
}

export async function getAllEvents() {
  return db.select().from(events).orderBy(events.createdAt)
}

export async function getEventById(id: string) {
  const [event] = await db.select().from(events).where(eq(events.id, id))
  return event ?? null
}

export async function updateEvent(id: string, data: EventInput) {
  const [event] = await db
    .update(events)
    .set({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning()

  return event
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id))
}
