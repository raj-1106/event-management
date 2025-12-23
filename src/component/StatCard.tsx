type StatCardProps = {
  title: string
  value: number
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-semibold mt-1 text-white">
        {value}
      </p>
    </div>
  )
}
