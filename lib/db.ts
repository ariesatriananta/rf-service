import mysql from 'mysql2/promise'

type DBConfig = {
  host: string
  user: string
  password: string
  database: string
  port?: number
  ssl?: any
  waitForConnections?: boolean
  connectionLimit?: number
  queueLimit?: number
}

const cfg: DBConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: Number(process.env.DB_PORT || 3306),
  ssl: process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

export const pool = mysql.createPool(cfg)

export async function query<T = any>(sql: string, params: any[] = []) {
  const [rows] = await pool.query<T[]>(sql, params)
  return rows
}

export async function getConnection() {
  return await pool.getConnection()
}
