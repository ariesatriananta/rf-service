import FlightBookingDetail from "@/components/booking/FlightBookingDetail"

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function FlightBookingPage({ searchParams }: PageProps) {
  return <FlightBookingDetail searchParams={searchParams} />
}

