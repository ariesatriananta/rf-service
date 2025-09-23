export type PaymentMethod = 'va' | 'transfer' | 'minimarket'

export const methodLabel = (method: PaymentMethod) =>
  method === 'va' ? 'VIRTUAL ACCOUNT' : method === 'transfer' ? 'BANK TRANSFER' : 'MINIMARKET'

export const defaultChannel = (method: PaymentMethod) =>
  method === 'va' ? 'BCA' : method === 'transfer' ? 'ATM BERSAMA' : 'Alfamart/Alfamidi'

export const vaPrefix = (bank?: string) => {
  switch ((bank || '').toUpperCase()) {
    case 'BCA':
      return '3901'
    case 'BRI':
      return '77777'
    case 'BNI':
      return '8808'
    default:
      return '3901'
  }
}

export function buildPaymentReference(
  method: PaymentMethod,
  channel: string,
  opts: { flightId?: string; orderCode?: string; amount?: number },
) {
  if (method === 'va') {
    const prefix = vaPrefix(channel)
    const base = (opts.flightId || opts.orderCode || '').toString()
    const tail = base.replace(/\D/g, '').slice(-6).padStart(6, '0') || '000000'
    return `${prefix}${tail}`
  }
  if (method === 'transfer') {
    const base = (opts.flightId || opts.orderCode || '').toString()
    const tail = base.replace(/\D/g, '').slice(-6).padStart(6, '0') || '000000'
    return `TRF${tail}`
  }
  const a = (opts.flightId || opts.orderCode || '').toString().slice(-4).replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  const b = String(opts.amount ?? '').replace(/\D/g, '').slice(0, 3).padStart(3, '0')
  return `RF-${a || 'XXXX'}-${b || '000'}`
}

