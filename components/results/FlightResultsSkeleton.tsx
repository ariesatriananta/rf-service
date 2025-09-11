import FlightCardSkeleton from "@/components/results/FlightCardSkeleton"

export default function FlightResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  )
}

