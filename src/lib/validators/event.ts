import { z } from 'zod'

export const eventInputSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  startDate: z.string(),
  endDate: z.string(),
})

export type EventInput = z.infer<typeof eventInputSchema>
