import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

/**
 * "People online now". Each open, active browser tab sends its random anonymous id here about once a minute; the id is
 * kept in a Redis sorted set scored by time, and the count is how many ids checked in during the last 130 seconds.
 * Nothing else is stored: no IP address, no cookie, nothing about the resume.
 *
 * Cost: everything happens in ONE Redis command per request (a small Lua script), because the free Upstash plan is
 * limited by the number of commands. Adding the id, removing old ids and counting are all inside that one script.
 */
const KEY = 'kriti:live'
const WINDOW_MS = 130_000
/** an id is 8 to 32 lowercase letters and digits; anything else is ignored */
const VALID_ID = /^[a-z0-9]{8,32}$/

/** KEYS[1] = the list; ARGV = now (ms), id, window (ms), "1" to add this id. Returns how many ids are within the window. */
const SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local from = string.format('%.0f', now - tonumber(ARGV[3]))
if ARGV[4] == '1' then redis.call('ZADD', key, ARGV[1], ARGV[2]) end
redis.call('ZREMRANGEBYSCORE', key, '-inf', '(' .. from)
return redis.call('ZCOUNT', key, from, '+inf')
`

// the Upstash integration on Vercel names its variables UPSTASH_REDIS_REST_* or KV_REST_API_*, depending on how it was added
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ count: null })
  if (!redis) return res.status(503).json({ count: null })

  try {
    const id = typeof req.query.id === 'string' ? req.query.id : ''
    const add = req.method === 'POST' && VALID_ID.test(id) ? '1' : '0'
    const count = await redis.eval<string[], number>(SCRIPT, [KEY], [String(Date.now()), id, String(WINDOW_MS), add])
    res.status(200).json({ count: Number(count) })
  } catch {
    res.status(502).json({ count: null })
  }
}
