export type Flight = {
  id: string
  airline: string
  code: string
  from: string
  to: string
  departTime: string
  arriveTime: string
  duration: string
  stops: number
  price: number
  fare: string
  image?: string
  badges?: string[]
}

export const mockFlights: Flight[] = [
  {
    id: "DL123",
    airline: "Delta",
    code: "DL 123",
    from: "JFK",
    to: "LAX",
    departTime: "08:10",
    arriveTime: "11:25",
    duration: "6h 15m",
    stops: 0,
    price: 289,
    fare: "Economy · 1 carry-on",
    image: "/airplane-wing-sunset-view-from-window.jpg",
    badges: ["Best", "Refundable"],
  },
  {
    id: "UA456",
    airline: "United",
    code: "UA 456",
    from: "EWR",
    to: "LAX",
    departTime: "09:30",
    arriveTime: "12:45",
    duration: "6h 15m",
    stops: 0,
    price: 279,
    fare: "Economy · Basic",
    image: "/airplane-interior-cabin-seats-aisle.jpg",
    badges: ["Shortest"],
  },
  {
    id: "B6789",
    airline: "JetBlue",
    code: "B6 789",
    from: "JFK",
    to: "LAX",
    departTime: "10:20",
    arriveTime: "13:45",
    duration: "6h 25m",
    stops: 0,
    price: 315,
    fare: "Even More Space · Wi‑Fi",
    image: "/airplane-exterior-wing-sky-clouds-sunset.jpg",
    badges: ["More legroom"],
  },
]

