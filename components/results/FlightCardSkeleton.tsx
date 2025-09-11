export default function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-full sm:w-40 h-36 sm:h-28 rounded-lg bg-gray-200" />
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="sm:text-right mt-4 sm:mt-0 w-full sm:w-40">
          <div className="h-6 w-28 bg-gray-200 rounded ml-auto" />
          <div className="h-4 w-16 bg-gray-200 rounded ml-auto mt-2" />
          <div className="h-8 w-full sm:w-24 bg-gray-200 rounded mt-3 ml-auto" />
        </div>
      </div>
    </div>
  )
}

