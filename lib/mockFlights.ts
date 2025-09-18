export type FlightClassOption = {
  type: "Economy" | "Bisnis"
  price: number
  fare?: string
  subtitle?: string
  perks: string[]
  rescheduleFee?: number
  refundableUpTo?: number // percentage
}

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
  logo?: string
  departDate?: string // yyyy-MM-dd
  classType?: "Economy" | "Bisnis"
  classes?: FlightClassOption[]
}

const baseFlights: (Omit<Flight, "departDate"> & { offset?: number })[] = [
  // Indonesia - CGK, DPS, SUB and more
  { id: "GA210", airline: "Garuda Indonesia", code: "GA 210", from: "CGK", to: "DPS", departTime: "06:00", arriveTime: "08:55", duration: "1h 55m", stops: 0, price: 1200000, fare: "Meal - Bagasi 20kg", classType: "Economy", logo: "/airlines/garuda-indonesia.png", badges: ["Best"], offset: 0 },
  { id: "JT12", airline: "Lion Air", code: "JT 12", from: "CGK", to: "DPS", departTime: "07:30", arriveTime: "09:35", duration: "2h 05m", stops: 0, price: 850000, fare: "Bagasi 20kg", classType: "Economy", logo: "/airlines/lion-air.png", offset: 0 },
  { id: "QG800", airline: "Citilink", code: "QG 800", from: "CGK", to: "DPS", departTime: "11:10", arriveTime: "13:10", duration: "2h 00m", stops: 0, price: 780000, fare: "Hand carry", classType: "Economy", logo: "/airlines/citilink.png", offset: 0 },
  { id: "ID6503", airline: "Batik Air", code: "ID 6503", from: "CGK", to: "DPS", departTime: "08:20", arriveTime: "09:45", duration: "1h 25m", stops: 0, price: 820000, fare: "Snack", classType: "Economy", logo: "/airlines/batik-air.png", offset: 0 },
  { id: "QG702", airline: "Citilink", code: "QG 702", from: "CGK", to: "DPS", departTime: "14:05", arriveTime: "15:35", duration: "1h 30m", stops: 0, price: 720000, fare: "Hand carry", classType: "Economy", logo: "/airlines/citilink.png", offset: 0 },
  { id: "IU780", airline: "Super Air Jet", code: "IU 780", from: "CGK", to: "DPS", departTime: "17:40", arriveTime: "19:45", duration: "2h 05m", stops: 0, price: 690000, fare: "Basic", classType: "Economy", logo: "/airlines/super-air-jet.png", badges: ["Value"], offset: 0 },
  { id: "QZ7516", airline: "AirAsia", code: "QZ 7516", from: "DPS", to: "CGK", departTime: "09:00", arriveTime: "10:55", duration: "1h 55m", stops: 0, price: 700000, fare: "Economy - Basic", logo: "/airlines/airasia.png", offset: 0 },
  { id: "GA411", airline: "Garuda Indonesia", code: "GA 411", from: "DPS", to: "CGK", departTime: "12:30", arriveTime: "14:25", duration: "1h 55m", stops: 0, price: 1450000, fare: "Meal", classType: "Bisnis", logo: "/airlines/garuda-indonesia.png", badges: ["Refundable", "Bisnis"], offset: 1 },
  { id: "JT509", airline: "Lion Air", code: "JT 509", from: "SUB", to: "CGK", departTime: "06:20", arriveTime: "07:50", duration: "1h 30m", stops: 0, price: 650000, fare: "Economy - 20kg bag", logo: "/airlines/lion-air.png", offset: 0 },
  { id: "GA321", airline: "Garuda Indonesia", code: "GA 321", from: "SUB", to: "CGK", departTime: "18:10", arriveTime: "19:35", duration: "1h 25m", stops: 0, price: 1200000, fare: "Meal", classType: "Economy", logo: "/airlines/garuda-indonesia.png", offset: 2 },
  { id: "QG745", airline: "Citilink", code: "QG 745", from: "DPS", to: "SUB", departTime: "15:20", arriveTime: "16:25", duration: "1h 05m", stops: 0, price: 600000, fare: "Economy - Hand carry", logo: "/airlines/citilink.png", offset: 1 },
  { id: "ID6580", airline: "Batik Air", code: "ID 6580", from: "SUB", to: "DPS", departTime: "20:10", arriveTime: "21:20", duration: "1h 10m", stops: 0, price: 620000, fare: "Economy - Snack", logo: "/airlines/batik-air.png", offset: 3 },
  // some with transit
  { id: "GA9001", airline: "Garuda Indonesia", code: "GA 9001", from: "CGK", to: "DPS", departTime: "10:00", arriveTime: "13:45", duration: "3h 45m", stops: 1, price: 1600000, fare: "Snack", classType: "Economy", logo: "/airlines/garuda-indonesia.png", offset: 0 },
  { id: "JT901", airline: "Lion Air", code: "JT 901", from: "CGK", to: "SUB", departTime: "13:15", arriveTime: "16:10", duration: "2h 55m", stops: 1, price: 900000, fare: "Economy - 1 stop via DPS", logo: "/airlines/lion-air.png", offset: 1 },
  { id: "QZ7001", airline: "AirAsia", code: "QZ 7001", from: "DPS", to: "SUB", departTime: "07:10", arriveTime: "09:20", duration: "2h 10m", stops: 1, price: 750000, fare: "Economy - 1 stop via CGK", logo: "/airlines/airasia.png", offset: 2 },
  // regional
  { id: "QZ200", airline: "AirAsia", code: "QZ 200", from: "CGK", to: "KUL", departTime: "06:30", arriveTime: "08:25", duration: "1h 55m", stops: 0, price: 1000000, fare: "Basic", classType: "Economy", logo: "/airlines/airasia.png", offset: 0 },
  { id: "TR281", airline: "Scoot", code: "TR 281", from: "CGK", to: "SIN", departTime: "11:00", arriveTime: "12:45", duration: "1h 45m", stops: 0, price: 1300000, fare: "Basic", classType: "Economy", logo: "/airlines/scoot.png", offset: 1 },
  { id: "GA846", airline: "Garuda Indonesia", code: "GA 846", from: "DPS", to: "SIN", departTime: "09:40", arriveTime: "12:15", duration: "2h 35m", stops: 0, price: 1900000, fare: "Economy - Meal", logo: "/airlines/garuda-indonesia.png", offset: 2 },

  // More Indonesia big cities
  { id: "JT300", airline: "Lion Air", code: "JT 300", from: "CGK", to: "KNO", departTime: "07:00", arriveTime: "09:10", duration: "2h 10m", stops: 0, price: 950000, fare: "Economy - 20kg bag", logo: "/airlines/lion-air.png", offset: 0 },
  { id: "QG310", airline: "Citilink", code: "QG 310", from: "KNO", to: "CGK", departTime: "12:00", arriveTime: "14:10", duration: "2h 10m", stops: 0, price: 900000, fare: "Economy - Hand carry", logo: "/airlines/citilink.png", offset: 1 },
  { id: "GA540", airline: "Garuda Indonesia", code: "GA 540", from: "UPG", to: "CGK", departTime: "06:30", arriveTime: "09:05", duration: "2h 35m", stops: 0, price: 1600000, fare: "Economy - Meal", logo: "/airlines/garuda-indonesia.png", offset: 0 },
  { id: "ID700", airline: "Batik Air", code: "ID 700", from: "CGK", to: "UPG", departTime: "16:30", arriveTime: "19:05", duration: "2h 35m", stops: 0, price: 1400000, fare: "Economy - Snack", logo: "/airlines/batik-air.png", offset: 2 },
  { id: "IU522", airline: "Super Air Jet", code: "IU 522", from: "BDO", to: "SUB", departTime: "09:20", arriveTime: "10:35", duration: "1h 15m", stops: 0, price: 620000, fare: "Economy - Basic", logo: "/airlines/super-air-jet.png", offset: 1 },
  { id: "QG520", airline: "Citilink", code: "QG 520", from: "SUB", to: "BDO", departTime: "18:20", arriveTime: "19:35", duration: "1h 15m", stops: 0, price: 630000, fare: "Economy - Hand carry", logo: "/airlines/citilink.png", offset: 2 },
]

const toIso = (d: Date) => {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().split("T")[0]
}

export function getMockFlights(): Flight[] {
  const today = new Date()
  return baseFlights.map((f) => {
    const departDate = toIso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + (f.offset || 0)))
    // Build class variants: ensure both Economy and Bisnis exist
    const basePrice = f.price
    const econ: FlightClassOption = {
      type: "Economy",
      price: f.classType === "Economy" ? basePrice : Math.max(Math.round(basePrice * 0.7), 300000),
      fare: /Meal|Bagasi|Hand|Basic|Snack/i.test(f.fare) ? f.fare : "Bagasi",
      subtitle: "Bagasi+",
      perks: [
        "Bagasi kabin 7 kg",
        "Bagasi 20 kg",
        "Kursi standar (jarak 29 inci)",
        "Tata kursi 3-3",
      ],
      rescheduleFee: 485200,
      refundableUpTo: 50,
    }
    const bisnis: FlightClassOption = {
      type: "Bisnis",
      price: f.classType === "Bisnis" ? basePrice : Math.max(Math.round(basePrice * 1.6), basePrice + 300000),
      fare: "Meal - Bagasi 30kg",
      subtitle: "Premium",
      perks: [
        "Bagasi kabin 10 kg",
        "Bagasi 30 kg",
        "Kursi prioritas recliner",
        "Lounge akses",
        "Makanan hangat",
      ],
      rescheduleFee: 325000,
      refundableUpTo: 75,
    }
    const classes: FlightClassOption[] = [econ, bisnis].sort((a, b) => a.price - b.price)
    const minPrice = Math.min(...classes.map((c) => c.price))
    return {
      ...f,
      departDate,
      classes,
      price: minPrice,
    }
  })
}


