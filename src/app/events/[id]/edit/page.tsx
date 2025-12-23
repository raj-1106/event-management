'use client'

import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/component/DashboardLayout'
import { Event } from '@/types/event'

type FormState = {
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
}

function toDateTimeLocal(value: string) {
  if (!value) return ''
  return value.slice(0, 16)
}

async function fetchEvent(id: string): Promise<Event> {
  const res = await fetch(`/api/events/${id}`)
  if (!res.ok) throw new Error('Failed to fetch event')
  return res.json()
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id),
  })

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
      })
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Failed to update event')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', id] })
      router.push(`/events/${id}`)
    },
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert('End date must be after start date')
      return
    }

    mutation.mutate()
  }

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
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-6">
          Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-input"
            />
          </FormField>

          <FormField label="Location">
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="Start Date & Time">
            <input
              type="datetime-local"
              name="startDate"
              value={toDateTimeLocal(form.startDate)}
              onChange={handleChange}
              required
              className="form-input"
            />
          </FormField>

          <FormField label="End Date & Time">
            <input
              type="datetime-local"
              name="endDate"
              value={toDateTimeLocal(form.endDate)}
              onChange={handleChange}
              required
              className="form-input"
            />
          </FormField>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="border border-neutral-700 px-5 py-2 rounded-lg text-sm text-gray-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

/* AXE-SAFE FormField (label wraps input) */
function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block text-sm text-gray-400">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  )
}
