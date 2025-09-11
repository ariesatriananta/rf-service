import FlightCardSkeleton from "@/components/results/FlightCardSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 lg:gap-8 items-start">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </div>
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

