import dynamic from "next/dynamic"

const PaymentPage = dynamic(() => import("@/components/payment/PaymentPage"), { ssr: false })

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function FlightPaymentPage({ searchParams }: PageProps) {
  return <PaymentPage searchParams={searchParams} />
}

