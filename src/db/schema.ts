import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),

  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
