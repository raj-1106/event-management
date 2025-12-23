'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/component/DashboardLayout'
import { Event } from '@/types/event'

async function fetchEvent(id: string): Promise<Event> {
  const res = await fetch(`/api/events/${id}`)
  if (!res.ok) throw new Error('Failed to fetch event')
  return res.json()
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete event')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      router.push('/events')
    },
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-gray-400">Loading event...</p>
      </DashboardLayout>
    )
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <p className="text-red-400">Event not found</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(data.startDate).toLocaleDateString()} • {data.location}
          </p>
        </div>

        <button
          onClick={() => router.push(`/events/${id}/edit`)}
          className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg text-sm font-medium"
        >
          Edit Event
        </button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <InfoCard
          label="Location"
          value={data.location}
        />
        <InfoCard
          label="Start"
          value={new Date(data.startDate).toLocaleString()}
        />
        <InfoCard
          label="End"
          value={new Date(data.endDate).toLocaleString()}
        />
      </div>

      {/* Description */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-medium mb-2">Description</h2>
        <p className="text-gray-400 text-sm">
          {data.description}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to delete this event?')) {
            deleteMutation.mutate()
          }
        }}
        disabled={deleteMutation.isPending}
        className="bg-red-600 hover:bg-red-500 transition px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete Event'}
      </button>
    </DashboardLayout>
  )
}

/* Small reusable info card */
function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium mt-1 text-white">
        {value}
      </p>
    </div>
  )
}
