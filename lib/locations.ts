export type Location = {
  type: "city" | "airport"
  city: string
  country: string
  name: string
  code: string // IATA or internal code
}

export const locations: Location[] = [
  { type: "city", city: "Jakarta", country: "Indonesia", name: "Jakarta Metropolitan", code: "JKTC" },
  { type: "airport", city: "Jakarta", country: "Indonesia", name: "Soekarno Hatta", code: "CGK" },
  { type: "airport", city: "Jakarta", country: "Indonesia", name: "Halim Perdanakusuma", code: "HLP" },
  { type: "city", city: "Yogyakarta", country: "Indonesia", name: "Yogyakarta", code: "JOGC" },
  { type: "airport", city: "Yogyakarta", country: "Indonesia", name: "Yogyakarta International", code: "YIA" },
  { type: "airport", city: "Denpasar", country: "Indonesia", name: "Ngurah Rai (Bali)", code: "DPS" },
  { type: "airport", city: "Surabaya", country: "Indonesia", name: "Juanda", code: "SUB" },
  { type: "airport", city: "Bandung", country: "Indonesia", name: "Husein Sastranegara", code: "BDO" },
  { type: "airport", city: "Semarang", country: "Indonesia", name: "Achmad Yani", code: "SRG" },
  { type: "airport", city: "Solo", country: "Indonesia", name: "Adi Soemarmo", code: "SOC" },
  { type: "airport", city: "Malang", country: "Indonesia", name: "Abdul Rachman Saleh", code: "MLG" },
  { type: "airport", city: "Medan", country: "Indonesia", name: "Kualanamu", code: "KNO" },
  { type: "airport", city: "Batam", country: "Indonesia", name: "Hang Nadim", code: "BTH" },
  { type: "airport", city: "Balikpapan", country: "Indonesia", name: "Sultan Aji Muhammad Sulaiman", code: "BPN" },
  { type: "airport", city: "Makassar", country: "Indonesia", name: "Sultan Hasanuddin", code: "UPG" },
  { type: "airport", city: "Manado", country: "Indonesia", name: "Sam Ratulangi", code: "MDC" },
  { type: "airport", city: "Lombok", country: "Indonesia", name: "Zainuddin Abdul Madjid", code: "LOP" },
  { type: "airport", city: "Palembang", country: "Indonesia", name: "Sultan Mahmud Badaruddin II", code: "PLM" },
  { type: "airport", city: "Pekanbaru", country: "Indonesia", name: "Sultan Syarif Kasim II", code: "PKU" },
  { type: "airport", city: "Pontianak", country: "Indonesia", name: "Supadio", code: "PNK" },
  { type: "airport", city: "Padang", country: "Indonesia", name: "Minangkabau", code: "PDG" },
  { type: "airport", city: "Banjarmasin", country: "Indonesia", name: "Syamsudin Noor", code: "BDJ" },
  { type: "airport", city: "Jambi", country: "Indonesia", name: "Sultan Thaha", code: "DJB" },
  { type: "airport", city: "Banda Aceh", country: "Indonesia", name: "Sultan Iskandar Muda", code: "BTJ" },
  { type: "airport", city: "Kupang", country: "Indonesia", name: "El Tari", code: "KOE" },
  { type: "airport", city: "Tarakan", country: "Indonesia", name: "Juwata", code: "TRK" },
  { type: "airport", city: "Tanjung Pandan", country: "Indonesia", name: "H.A.S. Hanandjoeddin", code: "TJQ" },
  { type: "airport", city: "Ternate", country: "Indonesia", name: "Babullah", code: "TTE" },
  { type: "airport", city: "Palu", country: "Indonesia", name: "Mutiara SIS Al-Jufri", code: "PLW" },
  { type: "airport", city: "Kendari", country: "Indonesia", name: "Haluoleo", code: "KDI" },
  { type: "airport", city: "New York", country: "United States", name: "John F. Kennedy", code: "JFK" },
  { type: "airport", city: "New York", country: "United States", name: "LaGuardia", code: "LGA" },
  { type: "airport", city: "Newark", country: "United States", name: "Newark Liberty", code: "EWR" },
  { type: "airport", city: "Los Angeles", country: "United States", name: "Los Angeles Intl.", code: "LAX" },
]

export function filterLocations(q: string): Location[] {
  const s = q.trim().toLowerCase()
  if (!s) return locations
  return locations.filter((l) =>
    [l.city, l.country, l.name, l.code].some((v) => v.toLowerCase().includes(s))
  )
}
