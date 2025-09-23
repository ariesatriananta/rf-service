import { NextRequest } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'invalid id' }), { status: 400 })
  const conn = await getConnection()
  try {
    const [rows] = await conn.query<any[]>(
      'SELECT orders_id, kode, payment_status, payment_reference, payment_channel, payment_expires_at, payment_total AS amount FROM t_orders WHERE orders_id = ? LIMIT 1',
      [id],
    )
    if (!Array.isArray(rows) || rows.length === 0) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 })
    const row = rows[0]
    return new Response(JSON.stringify(row), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e && e.message || e) }), { status: 500 })
  } finally {
    conn.release()
  }
}

