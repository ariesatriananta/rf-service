import { NextRequest } from 'next/server'
import { getConnection } from '@/lib/db'
import { buildPaymentReference, methodLabel, defaultChannel, type PaymentMethod } from '@/lib/payment'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'invalid order id' }), { status: 400 })
    const body = (await req.json()) as { method: PaymentMethod; channel?: string }
    const method = body.method
    const channel = body.channel || defaultChannel(method)

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
      const paymentReference = buildPaymentReference(method, channel, { orderCode: String(order.kode), amount: Number(order.payment_total) })
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

      await conn.query(
        "UPDATE t_orders SET payment_method = ?, payment_channel = ?, payment_reference = ?, payment_expires_at = ? WHERE orders_id = ?",
        [
          methodLabel(method),
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
