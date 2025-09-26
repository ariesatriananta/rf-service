import { NextRequest } from 'next/server'
import { getConnection } from '@/lib/db'
import { getMockFlights } from '@/lib/mockFlights'
import { buildPaymentReference, defaultChannel, methodLabel, type PaymentMethod } from '@/lib/payment'

type InitBody = {
  flightId: string
  fareCode?: string
  cabin?: string
  pax: number
  from?: string
  to?: string
  depart?: string
  returnDate?: string
  method: 'va' | 'transfer' | 'minimarket'
  channel?: string // 'BCA' | 'BRI' | 'BNI' | 'MANDIRI' | 'ATM BERSAMA' | 'Alfamart/Alfamidi' | 'Indomaret'
  contact?: {
    firstMiddle?: string
    lastName?: string
    email?: string
    phone?: string
  }
  passengers?: Array<{
    title?: string
    firstMiddle?: string
    lastName?: string
    birthDate?: string
    nationality?: string
    idNumber?: string
  }>
}

const EXPIRE_MINUTES = 30

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

const buildOrderCode = async (conn: any) => {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `ORD-${yy}${mm}`
  const [rows] = await conn.query("SELECT kode FROM t_orders WHERE kode LIKE ? ORDER BY kode DESC LIMIT 1 FOR UPDATE", [prefix + '%'])
  let seq = 1
  if (Array.isArray(rows) && rows.length) {
    const last = rows[0].kode as string
    const n = Number(last.slice(-4))
    if (Number.isFinite(n)) seq = n + 1
  }
  const code = `${prefix}${String(seq).padStart(4, '0')}`
  return code
}

const pickFirst = <T,>(arr?: T[]): T | undefined => (arr && arr.length ? arr[0] : undefined)

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InitBody
    const flightId = body.flightId
    const pax = Math.max(1, Number(body.pax || 1))
    const method = body.method
  const channel = body.channel || defaultChannel(method as PaymentMethod)
    const cabinReq = (body.cabin || 'economy').toLowerCase()
    const fareCode = body.fareCode

    if (!flightId) return new Response(JSON.stringify({ error: 'flightId required' }), { status: 400 })

    const flights = getMockFlights()
    const flight = flights.find((f) => f.id === flightId)
    if (!flight) return new Response(JSON.stringify({ error: 'flight not found' }), { status: 404 })
    const offering = flight.offerings.find((o) => o.cabinClass.toLowerCase() === cabinReq) || flight.offerings[0]
    if (!offering) return new Response(JSON.stringify({ error: 'offering not found' }), { status: 404 })
    const fare = fareCode ? offering.fareOptions.find((f) => f.code === fareCode) || offering.fareOptions[0] : offering.fareOptions[0]
    if (!fare) return new Response(JSON.stringify({ error: 'fare not found' }), { status: 404 })

    const unitPrice = fare.price
    const qty = pax
    const subtotal = unitPrice * qty
    const disc = 0
    const total = subtotal - disc

    // Build contact/customer
    const firstPassenger = pickFirst(body.passengers)
    const firstName = (body.contact?.firstMiddle || firstPassenger?.firstMiddle || '').trim()
    const lastName = (body.contact?.lastName || firstPassenger?.lastName || '').trim()
    const fullName = `${firstName} ${lastName}`.trim() || 'Customer'
    const email = (body.contact?.email || '').trim()
    const phone = (body.contact?.phone || '').trim()
    const identityType = 'KTP'
    const identityNumber = (firstPassenger?.idNumber || '').trim()
    const birthDateStr = (firstPassenger?.birthDate || '').trim()
    const birthDate = birthDateStr ? new Date(birthDateStr) : undefined

    // Email now required for customer identification
    if (!email) {
      return new Response(JSON.stringify({ error: 'email required' }), { status: 400 })
    }

    // Idempotency key no longer includes identityNumber; email is required
    const idempotencyKey = [
      flightId,
      offering.cabinClass,
      fare.code,
      String(pax),
      method,
      channel,
      email,
      new Date().toISOString().slice(0, 7), // YYYY-MM scope
    ].join('|')

    const paymentReference = buildPaymentReference(method as PaymentMethod, channel, { flightId: flight.id, amount: total })

    const expiresAt = new Date(Date.now() + EXPIRE_MINUTES * 60 * 1000)

    const conn = await getConnection()
    try {
      await conn.beginTransaction()

      // find or create customer (identify by email, fallback to identity number)
      let customerId: number | null = null
      // 1) Prefer find by email
      if (email) {
        const [rows] = await conn.query(
          "SELECT customer_id, first_name, last_name, full_name, phone FROM m_customer WHERE email = ? LIMIT 1",
          [email],
        )
        if (Array.isArray(rows) && rows.length) {
          customerId = rows[0].customer_id
          // Update name/phone if changed
          const existingFirst = (rows[0].first_name || '').trim()
          const existingLast = (rows[0].last_name || '').trim()
          const existingFull = (rows[0].full_name || '').trim()
          const existingPhone = (rows[0].phone || '').trim()

          const newFirst = (firstName || fullName).trim()
          const newLast = (lastName || '').trim()
          const newFull = fullName.trim()
          const newPhone = (phone || '').trim()

          const needUpdate =
            (newFirst && newFirst !== existingFirst) ||
            (newLast !== existingLast) ||
            (newFull !== existingFull) ||
            (newPhone !== existingPhone)

          if (needUpdate) {
            await conn.query(
              "UPDATE m_customer SET first_name = ?, last_name = ?, full_name = ?, phone = ? WHERE customer_id = ?",
              [newFirst, newLast, newFull, newPhone, customerId],
            )
          }
        }
      }
      // 2) No fallback to identity_number; email is the sole identifier
      // 3) Create new if still not found
      if (!customerId) {
        const [res] = await conn.query(
          "INSERT INTO m_customer (first_name, last_name, full_name, identity_type, identity_number, address, birth_date, phone, email, active) VALUES (?,?,?,?,?,?,?,?,?,1)",
          [
            firstName || fullName,
            lastName || '',
            fullName,
            identityType,
            identityNumber || '',
            null,
            birthDate ? new Date(birthDate) : null,
            phone || '',
            email || '',
          ],
        )
        // @ts-ignore
        customerId = res.insertId
      }

      // Check idempotency
      {
        const [rows] = await conn.query(
          "SELECT orders_id, kode, payment_reference, payment_channel, payment_expires_at, payment_status, payment_total FROM t_orders WHERE idempotency_key = ? AND payment_status = 'UNPAID' LIMIT 1",
          [idempotencyKey],
        )
        if (Array.isArray(rows) && rows.length) {
          await conn.commit()
          const r = rows[0]
          return new Response(
            JSON.stringify({
              orders_id: r.orders_id,
              kode: r.kode,
              payment_reference: r.payment_reference,
              payment_channel: r.payment_channel,
              payment_expires_at: r.payment_expires_at,
              amount: r.payment_total,
              payment_status: r.payment_status,
            }),
            { status: 200 },
          )
        }
      }

      // Generate order code (with lock on max row)
      const kode = await buildOrderCode(conn)

      // Insert order
      const passengersSanitized = (body.passengers || []).map((p) => ({
        title: p?.title || '',
        firstMiddle: (p?.firstMiddle || '').trim(),
        lastName: (p?.lastName || '').trim(),
        birthDate: (p?.birthDate || '').trim(),
        nationality: (p?.nationality || '').trim(),
        idNumber: (p?.idNumber || '').trim(),
      }))
      const notes = JSON.stringify({
        flightId: flight.id,
        airline: flight.airline,
        flight_code: flight.code,
        from: body.from || flight.from,
        to: body.to || flight.to,
        depart: body.depart || flight.departDate,
        return: body.returnDate || null,
        cabin: offering.cabinClass,
        fare_code: fare.code,
        contact: {
          firstMiddle: firstName,
          lastName: lastName,
          fullName,
          email,
          phone,
        },
        passengers: passengersSanitized,
      })

      const [ins] = await conn.query(
        `INSERT INTO t_orders (
          kode, customer_id, produk_id,
          unit_price, qty, subtotal, sales_price, agen_fee,
          payment_subtotal, payment_disc, payment_total,
          payment_method, payment_status, payment_channel, payment_reference, payment_expires_at,
          status, active, idempotency_key, notes, pax_count
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          kode,
          customerId,
          2, // produk_id tiket pesawat
          unitPrice,
          qty,
          subtotal,
          0,
          0,
          subtotal,
          disc,
          total,
          methodLabel(method as PaymentMethod),
          'UNPAID',
          channel,
          paymentReference,
          expiresAt,
          'CREATED',
          1,
          idempotencyKey,
          notes,
          pax,
        ],
      )

      await conn.commit()

      // @ts-ignore
      const insertedId = ins?.insertId as number | undefined
      return new Response(
        JSON.stringify({
          orders_id: insertedId,
          kode,
          payment_reference: paymentReference,
          payment_channel: channel,
          payment_expires_at: expiresAt,
          amount: total,
          payment_status: 'UNPAID',
          recipient_name: 'PT Jenovac Infinity Royal',
        }),
        { status: 200 },
      )
    } catch (e: any) {
      try { await conn.rollback() } catch {}
      // Handle duplicate idempotency key
      if (e && e.code === 'ER_DUP_ENTRY') {
        const [rows] = await conn.query(
          "SELECT orders_id, kode, payment_reference, payment_channel, payment_expires_at, payment_status, payment_total FROM t_orders WHERE idempotency_key = ? LIMIT 1",
          [idempotencyKey],
        )
        if (Array.isArray(rows) && rows.length) {
          const r = rows[0]
          return new Response(
            JSON.stringify({
              orders_id: r.orders_id,
              kode: r.kode,
              payment_reference: r.payment_reference,
              payment_channel: r.payment_channel,
              payment_expires_at: r.payment_expires_at,
              amount: r.payment_total,
              payment_status: r.payment_status,
            }),
            { status: 200 },
          )
        }
      }
      return new Response(JSON.stringify({ error: 'failed to init order', detail: String(e && e.message || e) }), { status: 500 })
    } finally {
      conn.release()
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'invalid request', detail: String(e && e.message || e) }), { status: 400 })
  }
}
