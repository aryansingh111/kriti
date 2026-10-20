import { motion, useInView } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { CITY_POINTS, MAP_H, MAP_W, STATE_PATHS } from './indiaMapData'
import { radius, REGION_COLOR, REGION_OF, REGIONS, type Place } from './indiaPlaces'

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}...` : s)

/** The hover card that floats beside a marker: city, state, count and the first few sample people. */
function Tooltip({ place, bx, by }: { place: Place; bx: number; by: number }) {
  const people = place.people.slice(0, 3)
  const more = place.people.length - people.length
  const w = 236
  const h = 56 + people.length * 17 + (more > 0 ? 17 : 0)
  const r = radius(place.count)
  const right = bx + r + 14 + w <= MAP_W - 4
  const x = right ? bx + r + 14 : bx - r - 14 - w
  const y = Math.min(Math.max(by - h / 2, 4), MAP_H - h - 4)
  const color = REGION_COLOR[place.region]
  const font = { fontFamily: 'var(--font-sans)' }
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={x} y={y} width={w} height={h} rx="14" filter="url(#pin-shadow)" style={{ fill: 'var(--surface)', stroke: 'var(--line-strong)' }} />
      <rect x={x} y={y} width="5" height={h} rx="2.5" style={{ fill: color }} />
      <text x={x + 18} y={y + 22} fontSize="15" fontWeight="800" style={{ ...font, fill: 'var(--ink)' }}>
        {place.city}
      </text>
      <text x={x + w - 14} y={y + 23} textAnchor="end" fontSize="19" fontWeight="800" style={{ ...font, fill: color }}>
        {place.count}
      </text>
      <text x={x + 18} y={y + 39} fontSize="11" style={{ ...font, fill: 'var(--muted)' }}>
        {place.state} - {place.count === 1 ? '1 template' : `${place.count} templates`}
      </text>
      {people.map((p, i) => (
        <text key={p.template} x={x + 18} y={y + 60 + i * 17} fontSize="11.5" style={{ ...font, fill: 'var(--ink)' }}>
          <tspan fontWeight="700">{clip(p.template, 14)}</tspan>
          <tspan style={{ fill: 'var(--muted)' }}>{`  ${clip(p.name, 22)}`}</tspan>
        </text>
      ))}
      {more > 0 && (
        <text x={x + 18} y={y + 60 + people.length * 17} fontSize="11" fontWeight="600" style={{ ...font, fill: 'var(--muted)' }}>
          and {more} more templates
        </text>
      )}
    </g>
  )
}

export function IndiaMap({ places }: { places: Map<string, Place> }) {
  const ref = useRef<SVGSVGElement>(null)
  const shown = useInView(ref, { once: true, margin: '-80px' })
  // the hover card shows only while a marker is pointed at or focused, never after the pointer has left
  const [active, setActive] = useState<string | null>(null)
  const current = active

  const markers = useMemo(
    () => CITY_POINTS.map((c, i) => ({ ...c, i, place: places.get(c.name) })).filter((c): c is typeof c & { place: Place } => !!c.place),
    [places],
  )
  const activeState = current ? places.get(current)?.state : null
  // the marker you point at is drawn last so it sits on top of its neighbours
  const sorted = useMemo(() => [...markers].sort((a, b) => (a.name === current ? 1 : b.name === current ? -1 : 0)), [markers, current])
  const focus = markers.find((m) => m.name === current)

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[860px]">
        <svg ref={ref} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-auto w-full overflow-visible" onMouseLeave={() => setActive(null)} role="group" aria-label="Map of India with the cities the resume templates are set in">
          <defs>
            <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#000" floodOpacity="0.28" />
            </filter>
          </defs>

          <g strokeLinejoin="round" fillRule="evenodd">
            {STATE_PATHS.map((s) => {
              const region = REGION_OF[s.name]
              const isActive = activeState === s.name
              const dim = !!activeState && !isActive
              return (
                <path
                  key={s.name}
                  d={s.d}
                  style={{
                    fill: region ? `color-mix(in srgb, ${REGION_COLOR[region]} ${isActive ? 45 : 17}%, var(--surface))` : 'var(--surface-3)',
                    stroke: isActive ? REGION_COLOR[region ?? 'Central'] : 'var(--surface)',
                    strokeWidth: isActive ? 1.6 : 1,
                    opacity: dim ? 0.55 : 1,
                    transition: 'fill 0.3s, opacity 0.3s, stroke 0.3s',
                  }}
                />
              )
            })}
          </g>

          {sorted.map((m) => {
            const color = REGION_COLOR[m.place.region]
            const r = radius(m.place.count)
            const on = current === m.name
            const nudged = Math.hypot(m.bx - m.x, m.by - m.y) > 4
            return (
              <g key={m.name}>
                {nudged && <line x1={m.x} y1={m.y} x2={m.bx} y2={m.by} strokeWidth="1.2" strokeOpacity="0.7" style={{ stroke: color }} />}
                <circle cx={m.x} cy={m.y} r="2.4" strokeWidth="1" style={{ fill: color, stroke: 'var(--surface)' }} />
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={shown ? { scale: 1, opacity: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.25 + m.i * 0.035 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  <motion.g
                    role="button"
                    tabIndex={0}
                    aria-label={`${m.name}, ${m.place.state}: ${m.place.count} ${m.place.count === 1 ? 'template' : 'templates'}`}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setActive(m.name)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(m.name)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(m.name)}
                    onKeyDown={(e) => e.key === 'Escape' && setActive(null)}
                    animate={{ scale: on ? 1.22 : 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  >
                    {on && <circle cx={m.bx} cy={m.by} r={r + 7} fillOpacity="0.18" style={{ fill: color }} />}
                    <circle cx={m.bx} cy={m.by} r={r} strokeWidth="2.2" filter="url(#pin-shadow)" style={{ fill: color, stroke: 'var(--surface)' }} />
                    <text
                      x={m.bx}
                      y={m.by}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={m.place.count > 9 ? 12 : 11.5}
                      fontWeight="800"
                      style={{ fill: 'var(--brand-ink)', fontFamily: 'var(--font-sans)', pointerEvents: 'none' }}
                    >
                      {m.place.count}
                    </text>
                  </motion.g>
                </motion.g>
              </g>
            )
          })}

          {focus && <Tooltip place={focus.place} bx={focus.bx} by={focus.by} />}
        </svg>
      </div>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5" aria-label="Regions">
        {REGIONS.map((r) => (
          <li key={r} className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: REGION_COLOR[r] }} />
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}
