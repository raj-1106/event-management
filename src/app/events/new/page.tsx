'use client'

import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DashboardLayout from '@/component/DashboardLayout'

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

export default function CreateEventPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Failed to create event')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      router.push('/events')
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

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-6">
          Create Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-gray-400">
            <span className="mb-1 block">Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="block text-sm text-gray-400">
            <span className="mb-1 block">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="form-input"
            />
          </label>

          <label className="block text-sm text-gray-400">
            <span className="mb-1 block">Location</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="block text-sm text-gray-400">
            <span className="mb-1 block">Start Date & Time</span>
            <input
              type="datetime-local"
              name="startDate"
              value={toDateTimeLocal(form.startDate)}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <label className="block text-sm text-gray-400">
            <span className="mb-1 block">End Date & Time</span>
            <input
              type="datetime-local"
              name="endDate"
              value={toDateTimeLocal(form.endDate)}
              onChange={handleChange}
              required
              className="form-input"
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-500 transition px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {mutation.isPending ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
