import { NextRequest } from 'next/server'
import { getConnection } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'invalid order id' }), { status: 400 })
    const body = (await req.json()) as { method: 'va' | 'transfer' | 'minimarket'; channel?: string; amount?: number }
    const method = body.method
    const channel = body.channel || (method === 'va' ? 'BCA' : method === 'transfer' ? 'ATM BERSAMA' : 'Alfamart/Alfamidi')

    const vaPrefix = (bank: string | undefined) => {
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

    const conn = await getConnection()
    try {
      await conn.beginTransaction()

      const [rows] = await conn.query("SELECT orders_id, payment_total, kode FROM t_orders WHERE orders_id = ? LIMIT 1", [id])
      if (!Array.isArray(rows) || rows.length === 0) {
        await conn.rollback()
        return new Response(JSON.stringify({ error: 'order not found' }), { status: 404 })
      }
      const order = rows[0]

      // regenerate reference (mock)
      let paymentReference: string
      if (method === 'va') {
        const tail = String(order.kode).replace(/\D/g, '').slice(-6).padStart(6, '0') || '000000'
        paymentReference = `${vaPrefix(channel)}${tail}`
      } else if (method === 'transfer') {
        const tail = String(order.kode).replace(/\D/g, '').slice(-6).padStart(6, '0') || '000000'
        paymentReference = `TRF${tail}`
      } else {
        const a = String(order.kode).slice(-4).replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const b = String(order.payment_total).replace(/\D/g, '').slice(0, 3).padStart(3, '0')
        paymentReference = `RF-${a}-${b}`
      }
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

      await conn.query(
        "UPDATE t_orders SET payment_method = ?, payment_channel = ?, payment_reference = ?, payment_expires_at = ? WHERE orders_id = ?",
        [
          method === 'va' ? 'VIRTUAL ACCOUNT' : method === 'transfer' ? 'BANK TRANSFER' : 'MINIMARKET',
          channel,
          paymentReference,
          expiresAt,
          id,
        ],
      )

      await conn.commit()
      return new Response(
        JSON.stringify({ payment_reference: paymentReference, payment_channel: channel, payment_expires_at: expiresAt }),
        { status: 200 },
      )
    } catch (e: any) {
      try { await conn.rollback() } catch {}
      return new Response(JSON.stringify({ error: 'failed to update method', detail: String(e && e.message || e) }), { status: 500 })
    } finally {
      conn.release()
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'invalid request', detail: String(e && e.message || e) }), { status: 400 })
  }
}

