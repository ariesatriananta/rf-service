import { NextRequest } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET(_req: NextRequest) {
  const env = {
    DB_HOST: process.env.DB_HOST || '',
    DB_USERNAME: process.env.DB_USERNAME ? 'set' : 'missing',
    DB_NAME: process.env.DB_NAME || '',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_SSL: process.env.DB_SSL || 'false',
  }
  let version: string | null = null
  let pong: number | null = null
  try {
    const conn = await getConnection()
    try {
      const [vrows] = await conn.query<any[]>("SELECT VERSION() AS version")
      if (Array.isArray(vrows) && vrows.length) version = vrows[0].version
      const [prows] = await conn.query<any[]>("SELECT 1 AS ping")
      if (Array.isArray(prows) && prows.length) pong = prows[0].ping
    } finally {
      conn.release()
    }
    return new Response(JSON.stringify({ ok: true, env, version, pong }), { status: 200 })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, env, error: String(e && e.message || e) }), { status: 500 })
  }
}

