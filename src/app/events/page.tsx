'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import DashboardLayout from '@/component/DashboardLayout'
import StatCard from '@/component/StatCard'
import { Event } from '@/types/event'

async function fetchEvents(): Promise<Event[]> {
  const res = await fetch('/api/events')
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export default function EventsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-gray-400">Loading events...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-400">Error loading events</p>
      </DashboardLayout>
    )
  }

  const totalEvents = data?.length ?? 0
  const upcomingEvents =
    data?.filter((e) => new Date(e.startDate) > new Date()).length ?? 0
  const pastEvents = totalEvents - upcomingEvents

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Events</h1>

        <Link
          href="/events/new"
          className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-lg text-sm font-medium"
        >
          Create Event
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Events" value={totalEvents} />
        <StatCard title="Upcoming Events" value={upcomingEvents} />
        <StatCard title="Past Events" value={pastEvents} />
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 cursor-pointer"
            >
              <h2 className="text-lg font-medium">{event.title}</h2>

              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {event.description}
              </p>

              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>{event.location}</span>
                <span>
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
