export type ContactForm = {
  firstMiddle: string
  lastName: string
  email: string
  phone: string
}

export type PassengerForm = {
  title: string
  firstMiddle: string
  lastName: string
  birthDate: string
  nationality: string
  idNumber: string
}

export const NATIONALITIES = [
  'Indonesia',
  'Singapura',
  'Malaysia',
  'Australia',
  'Amerika Serikat',
  'Inggris',
  'Jepang',
  'Korea Selatan',
]

export const buildPassengers = (count: number): PassengerForm[] =>
  Array.from({ length: count }, (_, idx) => ({
    title: idx === 0 ? 'Tuan' : 'Nyonya',
    firstMiddle: '',
    lastName: '',
    birthDate: '',
    nationality: 'Indonesia',
    idNumber: '',
  }))

export const ensureString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0]
  return value
}

